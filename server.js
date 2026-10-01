const express = require('express');
const cors = require('cors');
const path = require('path');
const ytdl = require('@distube/ytdl-core');
const { YoutubeTranscript } = require('youtube-transcript');

const app = express();
// ... existing code ...
// ROUTE 1: Cek Status API
app.get('/api/status', (req, res) => {
    res.json({ message: "TextFromClipper API is running!" });
});

// ROUTE 2: API untuk Tarik Video YouTube & Transkrip (REAL)
app.post('/api/fetch-youtube', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: "URL YouTube diperlukan" });
    }

    try {
        console.log(`Memproses YouTube URL: ${url}`);
        
        // 1. Dapatkan info video (Judul dll)
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;

        // 2. Dapatkan transkrip
        let transcriptText = "";
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(url);
            transcriptText = transcript.map(t => t.text).join(' ');
        } catch (e) {
            console.log("Transkrip gagal ditarik:", e.message);
            transcriptText = "Maaf, transkrip tidak tersedia (kemungkinan CC/Subtitle dimatikan pada video ini).";
        }

        res.json({
            success: true,
            video_title: title,
            transcript: transcriptText,
            stream_url: `/api/stream-video?url=${encodeURIComponent(url)}`
        });
    } catch (error) {
        console.error("Error Fetching Video:", error);
        res.status(500).json({ error: "Gagal mengambil video. Pastikan URL valid." });
    }
});

// ROUTE 2B: API untuk Streaming Video ke Frontend
app.get('/api/stream-video', (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL diperlukan");

    // Mengalirkan video langsung ke browser agar tidak membebani memori server
    res.header('Content-Disposition', 'inline; filename="video.mp4"');
    res.header('Content-Type', 'video/mp4');
    
    // Filter 'audioandvideo' memastikan ada gambar & suara
    ytdl(url, { filter: 'audioandvideo' }).pipe(res);
});

// ROUTE 3: API Analisa AI (MOCKUP)
