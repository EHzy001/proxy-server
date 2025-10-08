const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Port a Render-hez
const PORT = process.env.PORT || 3000;

// CORS middleware minden kéréshez
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // minden origin engedélyezve
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Preflight (OPTIONS) kérés kezelése
app.options('/proxy', (req, res) => {
  res.sendStatus(200);
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id parameter' });

    // API hívás
    const apiRes = await fetch(`https://api.gpplugins.com:2096/val/getLogs?id=${id}`);
    const data = await apiRes.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server indítása
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
