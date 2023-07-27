const net = require("net");
const query = require("./connectDatabase");

const HOST = "192.168.15.11"; // O nome de host ou endereço IP do servidor
const PORT = 4999; // A porta usada pelo servidor

let player1plus = null;
let player1reset = null;
let player1sub = null;

let player2plus = null;
let player2reset = null;
let player2sub = null;

const client = new net.Socket();

// Variáveis para controlar se o valor já foi atribuído
let player1Assigned = false;
let player2Assigned = false;
let count = 0;

// Função para conectar o cliente 1 ao servidor
function setcontrolPlayer1ButtonPlus() {
  client.connect(PORT, HOST, () => {
    console.log(`Client conectado ${HOST}:${PORT}\n`);
    console.log(
      "Os três primeiros Botões irão para a função +ponto, reset pontos e -pontos do time 1, e os próximos tres é para o time 2, caso tenha só um botão, aperte ele duas vezes para cancelar as outras opções, sera apesa cadastrado o +pontos"
    );
  });
  let script = null;

  client.on("data", (data) => {
    count++;
    let data1 = data.toString().split(",").toString();
    if (!player2Assigned) {
      if (!player1Assigned && count % 2 == 0) {
        if (count == 2) {
          player1plus = data.toString().split(",").toString();

          console.log(`Sinal de +pontos time1 cadastrado com sucesso`);
        } else {
          if (data1 != player1plus && count != 2) {
            if (count == 4) {
              player1reset = data.toString().split(",").toString();
              console.log(`Sinal de reset pontos time1 cadastrado com sucesso`);
            } else if (count == 6) {
              player1sub = data.toString().split(",").toString();
              console.log(`Sinal de -pontos time1 cadastrado com sucesso`);
              count = 0;
              player1Assigned = true;
            }
          } else {
            player1reset = "0";
            player1sub = "0";
            console.log("Apenas +pontos cadastrado");
            count = 0;
            player1Assigned = true;
          }
        }
      } else {
        if (count == 2) {
          player2plus = data.toString().split(",").toString();
          console.log(`Sinal de +pontos time2 cadastrado com sucesso`);
        } else {
          if (data1 != player2plus && count != 2) {
            if (count == 4) {
              player2reset = data.toString().split(",").toString();
              console.log(`Sinal de reset pontos time2 cadastrado com sucesso`);
            } else if (count == 6) {
              player2sub = data.toString().split(",").toString();
              console.log(`Sinal de -pontos time2 cadastrado com sucesso`);
              count = 0;
              player2Assigned = true;
            }
          } else {
            player2reset = "0";
            player2sub = "0";
            console.log("Apenas +pontos cadastrado");
            player2Assigned = true;
          }
        }
      }
    }
    if (player1Assigned && player2Assigned) {
      if (!script) {
        script = `INSERT INTO placar (controle_mais_1, controle_reset_1, controle_menos_1, controle_mais_2, controle_reset_2, controle_menos_2, painel_ip, id_torneio, id_quadra)
        VALUES ('${player1plus}', '${player1reset}', '${player1sub}', '${player2plus}', '${player2reset}', '${player2sub}', '192.168.1.100', 1, 1);`;
        console.log(script);
        query(script);
      } else {
        script = `teste`;
        console.log(script);
      }
    }
  });

  client.on("close", () => {
    console.log("Connection closed for client 1");
  });

  client.on("error", (error) => {
    console.error("Client 1 error:", error);
  });
}
setcontrolPlayer1ButtonPlus();
// Função para conectar o cliente 2 ao servidor
