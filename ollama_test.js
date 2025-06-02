import { Ollama } from 'ollama'

const ollama = new Ollama({ host: 'http://185.169.180.7:11434' })
const response = await ollama.chat({
  model: 'llama3.2',
  messages: [{ role: 'user', content: 'Why is the sky blue?' }],
})