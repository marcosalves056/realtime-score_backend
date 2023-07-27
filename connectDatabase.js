const mysql = require("mysql2");

// Configurar o banco de dados
const connection = mysql.createPool({
  host: "www.paulocruzautomacoes.com.br",
  user: "paulo449_root",
  password: "A)mU$YP]QL2c",
  database: "paulo449_placar_ao_vivo",
  port: 3306,
});

module.exports = function query(script) {
  connection.query(script, (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      return;
    }
    console.log(results);
  });
};
