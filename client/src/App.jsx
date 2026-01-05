import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Link as LinkIcon, Youtube, Instagram, Facebook, Twitter, 
  Loader2, Play, Music, Video, Zap, Shield, Smartphone, 
  Sun, Moon, CheckCircle2, ArrowRight, X, Film, Search, Menu,
  MonitorPlay, Star, ChevronDown, Linkedin, Github
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE = 'http://localhost:5000'; 

// --- MOCK DATA (Demo ke liye) ---
const DEMO_DATA = {
    title: "Grand Theft Auto VI Trailer 1 - 4K Ultra HD",
    thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000",
    duration: "01:31",
    author: "Rockstar Games",
    platform: "YouTube",
    views: "190M",
    qualities: [
        { label: '2160p (4K)', size: '450MB', type: 'MP4', badge: 'Ultra' },
        { label: '1440p (2K)', size: '280MB', type: 'MP4', badge: 'HD' },
        { label: '1080p', size: '150MB', type: 'MP4', badge: 'HD' },
        { label: '720p', size: '85MB', type: 'MP4', badge: 'SD' },
        { label: 'MP3 Audio', size: '5MB', type: 'MP3', badge: 'Audio' }
    ]
};

const REVIEWS = [
    { name: "Rahul S.", text: "Best downloader ever! 4K videos in seconds.", platform: "twitter" },
    { name: "Priya M.", text: "Finally a tool that works for Instagram Reels without ads.", platform: "instagram" },
    { name: "Amit K.", text: "Super clean UI and very fast processing.", platform: "facebook" },
    { name: "Sneha G.", text: "I use this daily for my content creation. Love it!", platform: "youtube" },
    { name: "Vikram R.", text: "No popups, no spam. Just pure downloads.", platform: "twitter" },
];

// --- COMPONENTS ---

// 1. Navbar
const Navbar = ({ darkMode, toggleTheme }) => (
  <nav className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300 ${darkMode ? 'bg-black/80 border-b border-white/10' : 'bg-white/80 border-b border-gray-200'} backdrop-blur-md`}>
    <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
            <Download className="text-white w-5 h-5" />
        </div>
        <span className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Bolt<span className="text-blue-500">Load</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className={`hidden md:block px-5 py-2 rounded-full text-sm font-bold transition-all ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
            Install App
        </button>
      </div>
    </div>
  </nav>
);

// 2. Social Media Icons Strip
const SocialStrip = ({ darkMode }) => (
    <div className="flex justify-center gap-6 mt-12 flex-wrap opacity-70 hover:opacity-100 transition-opacity">
        {[Youtube, Instagram, Facebook, Twitter, Linkedin, Github].map((Icon, i) => (
            <motion.div 
                key={i}
                whileHover={{ y: -5, scale: 1.1 }}
                className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-md hover:shadow-lg'}`}
            >
                <Icon size={24} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-blue-600'} />
            </motion.div>
        ))}
    </div>
);

// 3. Smart Download Card
const SmartCard = ({ data, onDownload, reset, darkMode }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`w-full max-w-5xl mx-auto rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden mt-10 ${darkMode ? 'bg-[#0F0F0F] border border-white/10' : 'bg-white border border-gray-100'}`}
    >
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Thumbnail */}
            <div className="w-full lg:w-[40%]">
                <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg group">
                    <img src={data.thumbnail} alt="Thumbnail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                            <Play className="text-white w-6 h-6 ml-1 fill-white" />
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-center px-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.platform}</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.duration}</span>
                </div>
            </div>

            {/* Right: Info & Buttons */}
            <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{data.title}</h2>
                <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Uploaded by {data.author}</p>

                <div className="space-y-3">
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Select Quality</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.qualities.map((q, i) => (
                            <button 
                                key={i}
                                onClick={() => onDownload(q.label, q.type)}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    darkMode 
                                    ? 'bg-white/5 border-white/5 hover:bg-blue-500/10 hover:border-blue-500/50 text-white' 
                                    : 'bg-gray-50 border-gray-100 hover:bg-blue-50 hover:border-blue-200 text-gray-900'
                                }`}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-sm">{q.label}</span>
                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{q.size}</span>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${q.type === 'MP3' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                    {q.badge}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={reset}
                    className={`mt-6 w-full py-3 text-sm font-medium hover:underline ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                >
                    Download another video
                </button>
            </div>
        </div>
    </motion.div>
);

// 4. Marquee Reviews
const MarqueeReviews = ({ darkMode }) => (
    <div className="w-full overflow-hidden py-10 relative">
        <div className={`absolute left-0 top-0 w-20 h-full z-10 bg-gradient-to-r ${darkMode ? 'from-[#050505] to-transparent' : 'from-[#FAFAFA] to-transparent'}`}></div>
        <div className={`absolute right-0 top-0 w-20 h-full z-10 bg-gradient-to-l ${darkMode ? 'from-[#050505] to-transparent' : 'from-[#FAFAFA] to-transparent'}`}></div>
        
        <motion.div 
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        >
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
                <div key={i} className={`w-80 p-6 rounded-2xl border flex flex-col gap-4 ${darkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{r.text}"</p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{r.name}</span>
                        <span className={`text-xs capitalize ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{r.platform}</span>
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
);

// 5. How It Works Steps
const StepCard = ({ number, title, desc, icon: Icon, darkMode }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className={`p-8 rounded-3xl border relative group ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-lg'}`}
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white ${darkMode ? 'bg-gray-800' : 'bg-blue-600'}`}>
            <Icon size={24} />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
        <span className="absolute top-6 right-6 text-5xl font-black opacity-5 select-none">0{number}</span>
    </motion.div>
);

// --- MAIN APP ---

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [videoData, setVideoData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!url) return;
    setStatus('loading');
    setErrorMsg('');
    setVideoData(null);

    // Using Demo Data for UI Showcase
    try {
        if (url || true) { 
            setTimeout(() => {
                setVideoData(DEMO_DATA);
                setStatus('success');
            }, 1500);
        }
    } catch (err) {
        setStatus('error');
    }
  };

  const handleDownload = (quality, type) => {
     // Trigger backend download
     const link = `${API_BASE}/api/download?url=${encodeURIComponent(url)}&quality=${quality}&type=${type}`;
     window.location.href = link;
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 selection:bg-blue-500/30 ${darkMode ? 'bg-[#050505] text-white' : 'bg-[#FAFAFA] text-gray-900'}`}>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
                className={`absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] ${darkMode ? 'bg-blue-900/20' : 'bg-blue-300/30'}`} 
            />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
                Download any <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                    Social Media Video
                </span>
            </motion.h1>
            
            <p className={`text-lg mb-10 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Support for YouTube, Instagram, Facebook, Twitter & TikTok. <br className="hidden md:block"/>
                Paste the link below and get started instantly.
            </p>

            {/* INPUT BOX */}
            <div className="max-w-2xl mx-auto relative z-20">
                <AnimatePresence mode='wait'>
                    {status !== 'success' ? (
                        <motion.form 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onSubmit={handleFetch}
                            className="relative group"
                        >
                            <div className={`absolute -inset-1 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500 bg-gradient-to-r from-blue-600 to-purple-600 ${status === 'loading' ? 'animate-pulse' : ''}`}></div>
                            <div className={`relative flex items-center p-2 pl-6 rounded-full shadow-2xl ${darkMode ? 'bg-[#151515] border border-white/10' : 'bg-white border border-gray-200'}`}>
                                <LinkIcon className={`mr-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                <input 
                                    type="text" 
                                    placeholder="Paste video URL..." 
                                    className={`flex-1 bg-transparent border-none outline-none text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    disabled={status === 'loading'}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all disabled:opacity-70 flex items-center gap-2"
                                >
                                    {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 'Download'}
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <SmartCard data={videoData} onDownload={handleDownload} reset={() => { setStatus('idle'); setUrl(''); setVideoData(null); }} darkMode={darkMode} />
                    )}
                </AnimatePresence>
            </div>

            {/* Social Icons Strip */}
            <SocialStrip darkMode={darkMode} />
        </div>
      </section>

      {/* --- MARQUEE REVIEWS --- */}
      <section className={`py-16 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="text-center mb-10">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trusted by 50,000+ Users</h2>
          </div>
          <MarqueeReviews darkMode={darkMode} />
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>How to Download</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Save your favorite videos in 3 simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard 
                number="1" 
                title="Paste Link" 
                desc="Copy the URL from the social media app and paste it in the box above." 
                icon={LinkIcon} 
                darkMode={darkMode} 
              />
              <StepCard 
                number="2" 
                title="Select Quality" 
                desc="Choose from 4K, 1080p, or convert to MP3 audio automatically." 
                icon={CheckCircle2} 
                darkMode={darkMode} 
              />
              <StepCard 
                number="3" 
                title="Download" 
                desc="Click the download button and the file saves instantly to your device." 
                icon={Download} 
                darkMode={darkMode} 
              />
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={`py-12 border-t ${darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-200'}`}>
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                    <Download className="text-white w-4 h-4" />
                </div>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>BoltLoad.</span>
             </div>
             
             <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                 © 2026 BoltLoad. All rights reserved.
             </p>

             <div className="flex gap-6">
                 {[Twitter, Instagram, Youtube, Facebook].map((Icon, i) => (
                     <a key={i} href="#" className={`transition-colors ${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-blue-600'}`}>
                         <Icon size={20} />
                     </a>
                 ))}
             </div>
         </div>
      </footer>
    </div>
  );
}