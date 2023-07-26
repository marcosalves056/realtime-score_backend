const net = require('net');
const connectClient = require('./client')

const HOST = "192.168.15.11"; // O nome de host ou endereço IP do servidor
const PORT = 4999; // A porta usada pelo servidor

let player1plus = null;
let player1reset = null;
let player1sub = null;

const client1 = new net.Socket();
const client2 = new net.Socket();
const client3 = new net.Socket();
const client4 = new net.Socket();

// Variáveis para controlar se o valor já foi atribuído
let player1plusAssigned = false;
let player1resetAssigned = false;
let player1subAssigned = false;

// Função para conectar o cliente 1 ao servidor
function setcontrolPlayer1ButtonPlus() {
  client1.connect(PORT, HOST, () => {
    console.log(`Client 1 connected to ${HOST}:${PORT}`);
    client1.write("This is player 1 for Plush Pints.");
  });

  client1.on('data', (data) => {
    console.log(`Received from server (client 1): ${data}`);
    if (!player1plusAssigned) {
      player1plus = data.toString().split(",");
      player1plusAssigned = true;
    } else {
      // Ignora o primeiro valor e atribui apenas o segundo
      player1plus = data.toString().split(",");
      client1.end();
    }
  });

  client1.on('close', () => {
    console.log('Connection closed for client 1');
    setcontrolPlayer1ButtonReset();
  });

  client1.on('error', (error) => {
    console.error('Client 1 error:', error);
  });
}

// Função para conectar o cliente 2 ao servidor
function setcontrolPlayer1ButtonReset() {
  client2.connect(PORT, HOST, () => {
    console.log(`Client 2 connected to ${HOST}:${PORT}`);
    client2.write("This is player 1 for button Reset points.");
  });

  client2.on('data', (data) => {
    console.log(`Received from server (client 2): ${data}`);
    if (!player1resetAssigned) {
      player1reset = data.toString().split(",");
      player1resetAssigned = true;
      client2.end();
    } else {
      // Ignora o primeiro valor e atribui apenas o segundo
      player1reset = data.toString().split(",");
    }
  });

  client2.on('close', () => {
    console.log('Connection closed for client 2');
    setcontrolPlayer1ButtonSub();
  });

  client2.on('error', (error) => {
    console.error('Client 2 error:', error);
  });
}

// Função para conectar o cliente 3 ao servidor
function setcontrolPlayer1ButtonSub() {
  client3.connect(PORT, HOST, () => {
    console.log(`Client 3 connected to ${HOST}:${PORT}`);
    client3.write("Hello, server! This is client 3 for player1sub.");
  });

  client3.on('data', (data) => {
    if (!(data.toString().split(",")[data.toString().split(",").length - 1] == player1reset[player1reset.length - 1])) {
      console.log(`Received from server (client 3): ${data}`);
      if (!player1subAssigned) {
        player1sub = data.toString().split(",");
        player1subAssigned = true;
        client3.end();
        setTimeout(()=>{connectClient(player1plus,player1reset,player1sub)},500); // Abre o client4 após fechar o client3
      } else {
        // Ignora o primeiro valor e atribui apenas o segundo
        player1sub = data.toString().split(",");
      }
      if (player1resetAssigned && player1subAssigned) {
        // Aqui você pode prosseguir com a lógica após receber todas as respostas
        // Certifique-se de verificar se todos os valores foram atribuídos corretamente
        if (player1subAssigned) {
          console.log("Dados do player1plus:", player1plus);
          console.log("Dados do player1reset:", player1reset);
          console.log("Dados do player1sub:", player1sub);
          
          // Faça a lógica necessária com os dados recebidos
        } else {
          console.log("Alguns dados estão faltando.");
        }
      }
    }
  });

  client3.on('close', () => {
    console.log('Connection closed for client 3');
  });

  client3.on('error', (error) => {
    console.error('Client 3 error:', error);
  });
}

// Função para conectar o cliente 4 ao servidor
function connectClient4() {
  client4.connect(PORT, HOST, () => {
    console.log(`Client 4 connected to ${HOST}:${PORT}`);
    client4.write("Iniciando contagem do jogo.");
  });

  client4.on('data', (data) => {
    const receivedData = data.toString().split(",").toString();
    console.log(receivedData)
    
    if((player1plus.toString() == receivedData.toString()) || (player1reset.toString() == receivedData) || (player1sub.toString() == receivedData)){
        // console.log("jogador1")
        if (receivedData ==  player1reset.toString()) {
            console.log("reset points");
        } else if (receivedData == player1plus.toString()) {
            console.log("+1 jogador 1");
        } else if (receivedData == player1sub.toString()) {
            console.log("+1 jogador 2");
        }}
    });

  client4.on('close', () => {
    console.log('Connection closed for client 4');
  });

  client4.on('error', (error) => {
    console.error('Client 4 error:', error);
  });
}

// Inicia a conexão do cliente 1
setcontrolPlayer1ButtonPlus();
// setcontrolPlayer1ButtonPlus();
