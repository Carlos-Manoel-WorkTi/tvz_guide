import express from 'express';
import guiaByChanel from './util/index.js'; 
import channels from './listTv/index.js'; 

const app = express();
const port = 3400;

const getCanaisProgramacao = async () => {
  const lista = await Promise.all(
    channels.map(async (channel) => {
      try {
        // Tenta buscar o canal e retorna o resultado
        return await guiaByChanel(channel.nomeOfc, channel.nome, channel.logo, channel.streamingUrl, channel.type);
      } catch (err) {
        // Loga o erro, mas não interrompe a execução
        console.error(`Erro ao buscar canal ${channel.nomeOfc}:`, err.message);
        return null; // Retorna null para canais que falharam
      }
    })
  );
  // Filtra e retorna apenas os canais que foram encontrados
  return lista.filter(canal => canal !== null);
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
    // Se nenhum canal for encontrado, retorna uma resposta apropriada
    if (canais.length === 0) {
      return res.status(404).json({ message: 'Nenhum canal encontrado.' });
    }
    res.json(canais);
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    res.status(500).json({ 
      error: 'Erro ao obter dados', 
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
