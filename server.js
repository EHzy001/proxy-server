const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Port, amin a proxy fut
const PORT = 3000;

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  try {
    const { id } = req.query; // pl. ?id=8Nv5v8tI

    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }

    // API hívás a valós szerverhez
    const apiRes = await fetch(`https://api.gpplugins.com:2096/val/getLogs?id=${id}`);
    const data = await apiRes.json();

    // Visszaadjuk a front-endnek CORS header-rel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
