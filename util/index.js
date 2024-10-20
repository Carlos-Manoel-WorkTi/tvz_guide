import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import channels from '../listTv/index.js'; // Importa a lista de canais

const guiaByChanel = async (nomeOfc, nome, logo, streamingUrl, type, font) => {
  try {
    console.log('Iniciando fetch ao canal ' + nome);
    
    const response = await fetch(`https://meuguia.tv/programacao/canal/${nome}`);
    const res = await response.text();

    // Carregar o HTML com Cheerio
    const $ = cheerio.load(res);

    // Selecionar o elemento com id="canal_header"
    const canalHeader = $('#canal_header');

    // Extrair informações do canal
    const backgroundColor = canalHeader.attr('style'); // Pega o estilo inline // Pega o conteúdo da logo
    const programacaoText = canalHeader.find('span').text(); // Pega o texto "PROGRAMAÇÃO"
    const canalName = canalHeader.find('h1').text(); // Pega o nome do canal "Cinemax"

    // Criar um objeto para armazenar as informações
    const canalInfo = {
      nomeOfc,
      logo,
      streamingUrl,
      type,
      backgroundColor, // Adicionando a cor de fundo ao objeto
      programacaoText,
      canalName,
      font_programas:font,
      programas: [] // Inicializa um array para os programas
    };

    // Selecionar todos os elementos <li> dentro da classe 'mw'
    const listaProgramas = $('.mw li');

    // Iterar sobre cada <li> e extrair informações
    listaProgramas.each((index, element) => {
      const programLink = $(element).find('a'); // Seleciona o link dentro do <li>
      const horario = programLink.find('.lileft.time').text(); // Horário
      const titulo = programLink.find('h2').text(); // Título do programa
      const genero = programLink.find('h3').text(); // Gênero do programa
      const status = programLink.find('.liright .noar').text(); // Status (NO AR)

      // Verificar se as informações não estão vazias antes de adicionar
      if (horario || titulo || genero || status) {
        canalInfo.programas.push({
          horario,
          titulo,
          genero,
          status
        });
      }
    });

    return canalInfo;

  } catch (error) {
    const canalInfo = {
      nomeOfc,
      logo,
      streamingUrl,
      type,
      programacaoText,
      canalName,
      font_programas:font,
      programas: []
    };

    console.error('Erro ao buscar dados:', error);
    canalInfo.programas.push({
      horario:"empty",
      titulo:"empty",
      genero:"empty",
      status:"empty"
    });
    return canalInfo; // Retornar null em caso de erro
  }
}

export default guiaByChanel;