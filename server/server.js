const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Helper for formatting
const formatSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
};

app.post('/api/info', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'URL required' });

    // Ensure we are getting the JSON metadata
    const ytDlp = spawn('yt-dlp', ['-J', '--no-playlist', '--flat-playlist', url]);
    let rawData = '';
    let errData = '';

    ytDlp.stdout.on('data', (chunk) => { rawData += chunk; });
    ytDlp.stderr.on('data', (chunk) => { errData += chunk; });

    ytDlp.on('close', (code) => {
        if (code !== 0) {
            console.error("yt-dlp error:", errData);
            return res.status(500).json({ success: false, message: 'Could not fetch video info. Link may be restricted.' });
        }
        try {
            const data = JSON.parse(rawData);
            const formats = data.formats || [];
            
            // Filter only MP4 video formats with audio
            const qualities = formats
                .filter(f => f.ext === 'mp4' && f.vcodec !== 'none' && f.acodec !== 'none')
                .map(f => ({
                    label: f.height + 'p',
                    size: formatSize(f.filesize || f.filesize_approx),
                    type: 'MP4',
                    badge: f.height >= 1080 ? 'HD' : 'SD'
                }))
                .filter((v, i, a) => a.findIndex(t => t.label === v.label) === i) // Unique heights
                .sort((a, b) => parseInt(b.label) - parseInt(a.label))
                .slice(0, 5);

            // Add MP3 fallback
            qualities.push({ label: 'MP3 Audio', size: '~5MB', type: 'MP3', badge: 'Audio' });

            res.json({
                success: true,
                data: {
                    title: data.title,
                    thumbnail: data.thumbnail,
                    duration: data.duration_string || "00:00",
                    author: data.uploader || 'Unknown',
                    platform: data.extractor_key,
                    qualities: qualities
                }
            });
        } catch (e) {
            res.status(500).json({ success: false, message: 'Data parsing error.' });
        }
    });
});

app.get('/api/download', (req, res) => {
    const { url, quality, type } = req.query;
    if (!url) return res.status(400).send("URL required");

    const ext = type === 'MP3' ? 'mp3' : 'mp4';
    res.header('Content-Disposition', `attachment; filename="video_${Date.now()}.${ext}"`);

    let args = [];
    if (type === 'MP3') {
        args = ['-x', '--audio-format', 'mp3', '-o', '-', url];
    } else {
        const height = quality ? quality.replace('p', '') : '1080';
        args = ['-f', `bestvideo[height<=${height}][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best`, '-o', '-', url];
    }

    const ytDlp = spawn('yt-dlp', args);
    ytDlp.stdout.pipe(res);

    req.on('close', () => {
        ytDlp.kill();
    });
});

app.listen(PORT, () => console.log(`🚀 API Port: ${PORT}`));