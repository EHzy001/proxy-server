const express = require('express');
const fetch = require('node-fetch'); // ez kell a Node.js-hez
const app = express();

const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('/proxy', (req, res) => res.sendStatus(200));

app.get('/proxy', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id parameter' });

    console.log(`Fetching API for id: ${id}`);
    const apiRes = await fetch(`https://api.gpplugins.com:2096/val/getLogs?id=${id}`);

    if (!apiRes.ok) {
      console.error(`API returned status ${apiRes.status}`);
      return res.status(502).json({ error: 'API request failed' });
    }

    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
