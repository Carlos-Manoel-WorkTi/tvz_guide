import express from 'express';
import guiaByChanel from './util/index.js'; 
import channels from './listTv/index.js'; 

const app = express();
const port = 3400;

const getCanaisProgramacao = async () => {
  const lista = await Promise.all(
    channels.map(channel =>
      guiaByChanel(channel.nomeOfc, channel.nome, channel.logo, channel.streamingUrl, channel.type)
    )
  );
  return lista.filter(canal => canal !== null);;
};

app.get('/', async (req, res) => {
  try {
    res.json("hello word"); 
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    res.status(500).json({ error: 'Erro ao obter dados' });
  }
});

app.get('/api/programacao', async (req, res) => {
  try {
    const canais = await getCanaisProgramacao();
    res.json(canais); 
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    res.status(500).json({ error: 'Erro ao obter dados' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
