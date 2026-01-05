/**
 * BoltLoad Backend - Enterprise V4
 * Features: Smart Quality Parsing, File Size Estimation, Audio Extraction
 */

const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// --- Helper: Format Bytes to MB/GB ---
const formatSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

// --- Helper: Get Badge (4K, HD, etc) ---
const getBadge = (height) => {
    if (height >= 2160) return 'Ultra'; // 4K
    if (height >= 1440) return '2K';
    if (height >= 1080) return 'HD';
    return 'SD';
};

// --- Helper: Parse yt-dlp Output ---
const parseMetaData = (rawJson) => {
    try {
        const data = JSON.parse(rawJson);
        const formats = data.formats || [];
        
        // 1. Filter usable video formats (mp4, with video)
        const videoFormats = formats.filter(f => f.vcodec !== 'none' && f.ext === 'mp4');
        
        // 2. Create Unique Qualities Map (Avoid duplicates)
        const qualityMap = new Map();

        videoFormats.forEach(f => {
            if (f.height) {
                // If this resolution isn't stored yet, or this format has a better bitrate/filesize
                if (!qualityMap.has(f.height)) {
                    qualityMap.set(f.height, {
                        label: `${f.height}p`,
                        size: formatSize(f.filesize || f.filesize_approx),
                        type: 'MP4',
                        badge: getBadge(f.height),
                        height: f.height
                    });
                }
            }
        });

        // 3. Sort by height (High to Low)
        const qualities = Array.from(qualityMap.values()).sort((a, b) => b.height - a.height);

        // 4. Add MP3 Option Manually (It's always available via conversion)
        qualities.push({
            label: 'MP3 Audio',
            size: '~5MB',
            type: 'MP3',
            badge: 'Audio'
        });

        return {
            title: data.title,
            thumbnail: data.thumbnail,
            duration: data.duration_string || "00:00",
            author: data.uploader || 'Unknown',
            platform: data.extractor_key || 'Web',
            views: data.view_count ? new Intl.NumberFormat('en-US', { notation: "compact" }).format(data.view_count) : 'N/A',
            qualities: qualities
        };
    } catch (e) {
        console.error("Parse Error:", e);
        return null;
    }
};

// --- API Routes ---

app.get('/health', (req, res) => res.send('BoltLoad API Active'));

app.post('/api/info', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'URL missing' });

    // Fetch JSON metadata
    const ytDlp = spawn('yt-dlp', ['-J', '--no-playlist', url]);
    let rawData = '';

    ytDlp.stdout.on('data', (chunk) => { rawData += chunk; });
    
    ytDlp.on('close', (code) => {
        if (code !== 0) return res.status(500).json({ success: false, message: 'Invalid URL or content private.' });
        
        const metadata = parseMetaData(rawData);
        if (!metadata) return res.status(500).json({ success: false, message: 'Failed to parse info.' });
        
        res.json({ success: true, data: metadata });
    });
});

app.get('/api/download', (req, res) => {
    const { url, quality, type } = req.query; // quality = "1080p", type = "MP4" or "MP3"
    if (!url) return res.status(400).send("URL required");

    const safeFilename = `boltload_${Date.now()}.${type === 'MP3' ? 'mp3' : 'mp4'}`;
    res.header('Content-Disposition', `attachment; filename="${safeFilename}"`);

    const args = [];
    
    if (type === 'MP3') {
        // Audio Extraction
        args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
    } else {
        // Video Extraction
        if (quality) {
            const height = quality.replace('p', '').replace(/[^0-9]/g, ''); // Extract number "1080"
            // Download best video <= height + best audio
            args.push('-f', `bestvideo[height<=${height}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${height}][ext=mp4]/best`);
        } else {
            args.push('-f', 'bestvideo+bestaudio/best');
        }
    }

    // Output to stdout (Stream to user)
    args.push('-o', '-', url);

    const ytDlp = spawn('yt-dlp', args);
    ytDlp.stdout.pipe(res);
    
    // Cleanup on client disconnect
    req.on('close', () => {
        ytDlp.kill();
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));