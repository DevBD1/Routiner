const express = require('express');
const cors = require('cors');
const ollama = require('ollama');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { prompt, model = 'llama2' } = req.body;
  try {
    // Use the ollama package to generate a response
    const response = await ollama.generate({ model, prompt });
    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Ollama backend running on port ${PORT}`));