/**
 * TEXTFROMCLIPPER APP - BACKEND SERVER
 * ------------------------------------
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
// const ytdl = require('ytdl-core'); // Nanti digunakan untuk unduh video
// const { GoogleGenerativeAI } = require('@google/generative-ai'); // AI SDK

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json());

// PENTING: Baris ini membuat server Node.js membaca file index.html 
// yang akan kita letakkan di dalam folder bernama "public"
app.use(express.static(path.join(__dirname, 'public')));

// ROUTE 1: Cek Status API
app.get('/api/status', (req, res) => {
    res.json({ message: "TextFromClipper API is running!" });
});

// ROUTE 2: API untuk Tarik Video YouTube & Transkrip (MOCKUP)
app.post('/api/fetch-youtube', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: "URL YouTube diperlukan" });
    }

    try {
        console.log(`Memproses YouTube URL: ${url}`);
        res.json({
            success: true,
            video_title: "Contoh Judul Podcast",
            transcript: "Halo semuanya, selamat datang kembali...",
            video_url: "url_video_sementara_di_server.mp4"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ROUTE 3: API Analisa AI (MOCKUP)
app.post('/api/analyze-viral', async (req, res) => {
    const { transcript } = req.body;

    res.json({
        success: true,
        recommended_clip: {
            start_time: 15.5,
            end_time: 45.0,
            caption_suggestion: "Rahasia terbesar terungkap! 😱"
        }
    });
});

// Jika user mengakses URL utama, tampilkan index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 TextFromClipper Server berjalan di http://localhost:${PORT}`);
});
