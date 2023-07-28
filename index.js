const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Configurar o banco de dados
const connection = mysql.createPool({
  host: "www.paulocruzautomacoes.com.br",
  user: "paulo449_root",
  password: "A)mU$YP]QL2c",
  database: "paulo449_placar_ao_vivo",
  port: 3306,
  // protocol: 'TCP'
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/dados", async (req, res) => {
  try {
    const jsonData = {
      dados: [],
    };

    // Fetch entidades from the database
    const entidades = await new Promise((resolve, reject) => {
      connection.query("SELECT * FROM entidades", (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    const fetchTorneios = (entidadeId) => {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM torneios WHERE id_entidade = ?",
          entidadeId,
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
    };

    const fetchQuadras = (torneioId) => {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM quadras WHERE id_torneio = ?",
          torneioId,
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
    };
    const fetchEsporte = (torneio) => {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT nome FROM esportes WHERE id = ?",
          torneio.id_esporte,
          (err, esporte) => {
            if (err) {
              reject(err);
            } else {
              resolve(esporte[0].nome); // Corrigido para retornar apenas o nome do esporte
            }
          }
        );
      });
    };

    const fetchPlayerName = (playerId) => {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT nome FROM jogadores WHERE id = ?",
          [playerId], // Adicionamos o ID do jogador como um array para o placeholder `?`
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results[0]?.nome || ""); // Retorna o nome do jogador ou uma string vazia se não encontrar o jogador
            }
          }
        );
      });
    };

    const fetchEntidadesAndBuildJson = async () => {
      for (const entidade of entidades) {
        const entidadeObj = {
          nome_entidade: entidade.nome,
          torneios: [],
        };

        // Fetch torneios for each entidade
        const torneios = await fetchTorneios(entidade.id);

        for (const torneio of torneios) {
          const quadras = [];

          // Fetch quadras for each torneio
          const quadrasData = await fetchQuadras(torneio.id);

          for (const quadra of quadrasData) {
            // Fetch players' names using their IDs
            const jogador1Nome = await fetchPlayerName(quadra.jogador1);
            const jogador2Nome = await fetchPlayerName(quadra.jogador2);
            const jogador3Nome = await fetchPlayerName(quadra.jogador3);
            const jogador4Nome = await fetchPlayerName(quadra.jogador4);

            const quadraObj = {
              categoria: quadra.categoria,
              estado: quadra.estado,
              games: [JSON.parse(quadra.games)],
              jogador1: jogador1Nome,
              jogador2: jogador2Nome,
              jogador3: jogador3Nome,
              jogador4: jogador4Nome,
              pontos: JSON.parse(quadra.pontos),
              quadra: quadra.quadra,
              rodada: quadra.rodada,
              status: quadra.status,
            };

            quadras.push(quadraObj);
          }

          entidadeObj.torneios.push({
            nome_torneio: torneio.nome,
            quadras: quadras,
          });
        }

        jsonData.dados.push({
          esporte: await fetchEsporte(torneios[0]), // Corrigido para aguardar o resultado da função fetchEsporte
          entidades: [entidadeObj],
        });
      }

      res.json(jsonData);
    };

    fetchEntidadesAndBuildJson().catch((err) => {
      console.error("Erro ao buscar informações:", err);
      res.status(500).json({ error: "Erro ao buscar informações" });
    });
  } catch (err) {
    console.error("Erro ao buscar entidades:", err);
    res.status(500).json({ error: "Erro ao buscar entidades" });
  }
});

// Rotas CRUD para a tabela 'jogadores'
app.get("/jogadores", (req, res) => {
  connection.query("SELECT * FROM jogadores", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      res.status(500).json({ error: "Erro ao buscar jogadores" });
      return;
    }
    res.json(results);
  });
  console.log(req);
});

app.post("/jogadores", (req, res) => {
  const jogador = req.body;
  connection.query("INSERT INTO jogadores SET ?", jogador, (err, result) => {
    if (err) {
      console.error("Erro ao executar a inserção:", err);
      res.status(500).json({ error: "Erro ao adicionar jogador" });
      return;
    }
    res.json({ id: result.insertId, ...jogador });
  });
});

app.put("/jogadores/:id", (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query(
    "UPDATE jogadores SET ? WHERE id = ?",
    [jogador, id],
    (err) => {
      if (err) {
        console.error("Erro ao executar a atualização:", err);
        res.status(500).json({ error: "Erro ao atualizar jogador" });
        return;
      }
      res.json({ id, ...jogador });
    }
  );
});

app.delete("/jogadores/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM jogadores WHERE id = ?", id, (err) => {
    if (err) {
      console.error("Erro ao executar a exclusão:", err);
      res.status(500).json({ error: "Erro ao excluir jogador" });
      return;
    }
    res.json({ id });
  });
});

app.get("/jogadores", (req, res) => {
  connection.query("SELECT * FROM jogadores", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      res.status(500).json({ error: "Erro ao buscar jogadores" });
      return;
    }
    res.json(results);
  });
  console.log(req);
});

app.post("/jogadores", (req, res) => {
  const jogador = req.body;
  connection.query("INSERT INTO jogadores SET ?", jogador, (err, result) => {
    if (err) {
      console.error("Erro ao executar a inserção:", err);
      res.status(500).json({ error: "Erro ao adicionar jogador" });
      return;
    }
    res.json({ id: result.insertId, ...jogador });
  });
});

app.put("/jogadores/:id", (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query(
    "UPDATE jogadores SET ? WHERE id = ?",
    [jogador, id],
    (err) => {
      if (err) {
        console.error("Erro ao executar a atualização:", err);
        res.status(500).json({ error: "Erro ao atualizar jogador" });
        return;
      }
      res.json({ id, ...jogador });
    }
  );
});

app.delete("/jogadores/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM jogadores WHERE id = ?", id, (err) => {
    if (err) {
      console.error("Erro ao executar a exclusão:", err);
      res.status(500).json({ error: "Erro ao excluir jogador" });
      return;
    }
    res.json({ id });
  });
});

// esportes

app.get("/entidades", (req, res) => {
  connection.query("SELECT * FROM entidades", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      res.status(500).json({ error: "Erro ao buscar entidades" });
      return;
    }
    res.json(results);
  });
  console.log(req);
});

app.post("/entidades", (req, res) => {
  const jogador = req.body;
  connection.query("INSERT INTO entidades SET ?", jogador, (err, result) => {
    if (err) {
      console.error("Erro ao executar a inserção:", err);
      res.status(500).json({ error: "Erro ao adicionar jogador" });
      return;
    }
    res.json({ id: result.insertId, ...jogador });
  });
});

app.put("/entidades/:id", (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query(
    "UPDATE entidades SET ? WHERE id = ?",
    [jogador, id],
    (err) => {
      if (err) {
        console.error("Erro ao executar a atualização:", err);
        res.status(500).json({ error: "Erro ao atualizar jogador" });
        return;
      }
      res.json({ id, ...jogador });
    }
  );
});

app.delete("/entidades/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM entidades WHERE id = ?", id, (err) => {
    if (err) {
      console.error("Erro ao executar a exclusão:", err);
      res.status(500).json({ error: "Erro ao excluir jogador" });
      return;
    }
    res.json({ id });
  });
});

// entidades

app.get("/esportes", (req, res) => {
  connection.query("SELECT * FROM esportes", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      res.status(500).json({ error: "Erro ao buscar esportes" });
      return;
    }
    res.json(results);
  });
  console.log(req);
});

app.post("/esportes", (req, res) => {
  const jogador = req.body;
  connection.query("INSERT INTO esportes SET ?", jogador, (err, result) => {
    if (err) {
      console.error("Erro ao executar a inserção:", err);
      res.status(500).json({ error: "Erro ao adicionar jogador" });
      return;
    }
    res.json({ id: result.insertId, ...jogador });
  });
});

app.put("/esportes/:id", (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query(
    "UPDATE esportes SET ? WHERE id = ?",
    [jogador, id],
    (err) => {
      if (err) {
        console.error("Erro ao executar a atualização:", err);
        res.status(500).json({ error: "Erro ao atualizar jogador" });
        return;
      }
      res.json({ id, ...jogador });
    }
  );
});

app.delete("/esportes/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM esportes WHERE id = ?", id, (err) => {
    if (err) {
      console.error("Erro ao executar a exclusão:", err);
      res.status(500).json({ error: "Erro ao excluir jogador" });
      return;
    }
    res.json({ id });
  });
});

// torneios

app.get("/torneios", (req, res) => {
  connection.query("SELECT * FROM torneios", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      res.status(500).json({ error: "Erro ao buscar torneios" });
      return;
    }
    res.json(results);
  });
  console.log(req);
});

app.post("/torneios", (req, res) => {
  const jogador = req.body;
  connection.query("INSERT INTO torneios SET ?", jogador, (err, result) => {
    if (err) {
      console.error("Erro ao executar a inserção:", err);
      res.status(500).json({ error: "Erro ao adicionar jogador" });
      return;
    }
    res.json({ id: result.insertId, ...jogador });
  });
});

app.put("/torneios/:id", (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query(
    "UPDATE torneios SET ? WHERE id = ?",
    [jogador, id],
    (err) => {
      if (err) {
        console.error("Erro ao executar a atualização:", err);
        res.status(500).json({ error: "Erro ao atualizar jogador" });
        return;
      }
      res.json({ id, ...jogador });
    }
  );
});

app.delete("/torneios/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM torneios WHERE id = ?", id, (err) => {
    if (err) {
      console.error("Erro ao executar a exclusão:", err);
      res.status(500).json({ error: "Erro ao excluir jogador" });
      return;
    }
    res.json({ id });
  });
});

// quadras

app.get("/quadras", (req, res) => {
  connection.query("SELECT * FROM quadras", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      res.status(500).json({ error: "Erro ao buscar quadras" });
      return;
    }
    res.json(results);
  });
  console.log(req);
});

app.post("/quadras", (req, res) => {
  const quadras = req.body;
  console.log(quadras);

  console.log(quadras["games"]);
  connection.query("INSERT INTO quadras SET ?", quadras, (err, result) => {
    if (err) {
      console.error("Erro ao executar a inserção:", err);
      res.status(500).json({ error: "Erro ao adicionar jogador" });
      return;
    }
    res.json({ id: result.insertId, ...quadras });
  });
});

app.put("/quadras/:id", (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query(
    "UPDATE quadras SET ? WHERE id = ?",
    [jogador, id],
    (err) => {
      if (err) {
        console.error("Erro ao executar a atualização:", err);
        res.status(500).json({ error: "Erro ao atualizar jogador" });
        return;
      }
      res.json({ id, ...jogador });
    }
  );
});

app.delete("/quadras/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM quadras WHERE id = ?", id, (err) => {
    if (err) {
      console.error("Erro ao executar a exclusão:", err);
      res.status(500).json({ error: "Erro ao excluir jogador" });
      return;
    }
    res.json({ id });
  });
});

// Placar

app.get("/placar", (req, res) => {
  connection.query("SELECT * FROM placar", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      res.status(500).json({ error: "Erro ao buscar placar" });
      return;
    }
    res.json(results);
  });
  console.log(req);
});

app.post("/placar", (req, res) => {
  const placar = req.body;
  connection.query("INSERT INTO placar SET ?", placar, (err, result) => {
    if (err) {
      console.error("Erro ao executar a inserção:", err);
      res.status(500).json({ error: "Erro ao adicionar jogador" });
      return;
    }
    res.json({ id: result.insertId, ...jogador });
  });
});

app.put("/placar/:id", (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query("UPDATE placar SET ? WHERE id = ?", [jogador, id], (err) => {
    if (err) {
      console.error("Erro ao executar a atualização:", err);
      res.status(500).json({ error: "Erro ao atualizar jogador" });
      return;
    }
    res.json({ id, ...jogador });
  });
});

app.delete("/placar/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM placar WHERE id = ?", id, (err) => {
    if (err) {
      console.error("Erro ao executar a exclusão:", err);
      res.status(500).json({ error: "Erro ao excluir jogador" });
      return;
    }
    res.json({ id });
  });
});
// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
