require('dotenv').config();
const express = require('express');
const app = express();
const Word = require('./models/Word');
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const { Sequelize } = require('sequelize');
app.use(cors());
app.use(express.json());

Word.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Error syncing database:', err));

app.post('/api/words', async (req, res) => {
  try {
    const word = await Word.create(req.body);
    res.status(201).json(word);
  } catch (err) {
    res.status(500).json({error: err.message}); 
  }
})

app.post('/api/add', async (req, res) => {
  const { title, definition, example, author } = req.body;
  const date = new Date();

  if (!title || !definition || !author || !example) {
    return res.status(400).json({ error: 'Title, definition, author, and example are required' });
  }

  try {
    const newWord = await Word.create({
      title,
      definition,
      example: Array.isArray(example) ? example : [example],
      author,
      date,
    });

    res.status(201).json(newWord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/random', async (req, res) => {
  try {
    const word = await Word.findOne({ order: Sequelize.literal('RANDOM()')});

    if (!word) {
      return res.status(404).json({error: 'No words found'});
    }

    res.json(word);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
})

app.get('/api/words/title/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const word = await Word.findAll({ where: { title } });
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    res.json(word);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 

// curl -X GET "http://localhost:8000/api/words/title/Ph%C3%B4ng%20b%E1%BA%A1t"


app.get('/api/words', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0; 

  try {
    const words = await Word.findAll({
      limit: limit,
      offset: offset
    });

    res.json(words);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});