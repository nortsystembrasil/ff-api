const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    api: 'Free Fire Mania',
    endpoint: '/ff/:id'
  });
});

app.get('/ff/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const url = `https://www.freefiremania.com.br/perfil/${id}.html`;

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 15000
    });

    const $ = cheerio.load(data);

    const getText = label =>
      $(`strong:contains("${label}")`).next().text().trim() || 'N/A';

    const bio = $('#bioContent').text().trim() || 'N/A';

    const image =
      $('meta[property="og:image"]').attr('content') || null;

    res.json({
      id,
      nick: getText('Nick'),
      level: getText('Level'),
      likes: getText('Likes'),
      region: getText('Região'),
      created_at: getText('Conta criada em'),
      last_login: getText('Último login em'),
      guild: getText('Guilda'),
      bio,
      image
    });

  } catch (err) {
    res.status(500).json({
      error: true,
      message: 'Não foi possível buscar o perfil'
    });
  }
});

app.listen(PORT, () => {
  console.log('API online na porta ' + PORT);
});
