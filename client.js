// const { connect } = require('http2');
const net = require('net');
const admin = require('firebase-admin');

const HOST = "192.168.15.11"; // O nome de host ou endereço IP do servidor
const PORT = 4999; // A porta usada pelo servidor

const client = new net.Socket();

const serviceAccount = require('./placar-ao-vivo-firebase-adminsdk-16os3-b0dd4cf342.json'); // Substitua pelo caminho para o arquivo JSON da chave de serviço do Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://placar-ao-vivo-default-rtdb.firebaseio.com/", // Substitua pela sua URL do Firebase Realtime Database
});

const db = admin.database();
var points1 =0
var points2 =0

// Função para atualizar os dados no Firebase Realtime Database
function updatePoints(player) {
  const ref = db.ref('dados/1/entidades/0/torneios/0/quadras/0/pontos'); // Substitua pelo caminho para os dados que você deseja atualizar
  if(player == 1){
    points1++
  }
  else{
    points2++
  }
  // Substitua os dados abaixo pelos novos dados que você deseja atualizar
  const novosDados = {
    jogador1: points1,
    jogador2: points2,
    // ... adicione os campos e valores que você deseja atualizar
  };

  ref.update(novosDados)
    .then(() => {
      console.log('Dados atualizados com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao atualizar dados:', error);
    });
}


module.exports = function connectClient(player1Plus, player1Reset, player1Sub) {
    client.connect(PORT, HOST, () => {
      console.log(`Client 4 connected to ${HOST}:${PORT}`);
      client.write("Hello, server! This is client 4.");
    });
  
    client.on('data', (data) => {
      const receivedData = data.toString().split(",").toString();
      console.log(receivedData)
      
      if((player1Plus.toString() == receivedData.toString()) || (player1Reset.toString() == receivedData) || (player1Sub.toString() == receivedData)){
          // console.log("jogador1")
          if (receivedData ==  player1Reset.toString()) {
              console.log("reset points");
            } else if (receivedData == player1Plus.toString()) {
              console.log("+1 jogador 1");
              updatePoints(1);
              
            } else if (receivedData == player1Sub.toString()) {
              console.log("+1 jogador 2");
              updatePoints(0);
          }}
      });
  
    client.on('close', () => {
      console.log('Connection closed for client 4');
    });
  
    client.on('error', (error) => {
      console.error('Client 4 error:', error);
    });
  }

  // connectClient()