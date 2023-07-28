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
  const jsonData = {
    dados: [],
  };

  try {
    const entidades = await getEntidades();

    for (const entidade of entidades) {
      const entidadeObj = {
        nome_entidade: entidade.nome,
        torneios: [],
      };

      const torneios = await getTorneios(entidade.id);

      for (const torneio of torneios) {
        const quadras = await getQuadras(torneio.id);

        for (const quadra of quadras) {
          const jogadores = await getJogadoresFromQuadra(quadra);

          const quadraObj = {
            categoria: quadra.categoria,
            estado: quadra.estado,
            games: [JSON.parse(quadra.games)],
            jogador1: jogadores[0]?.nome || null,
            jogador2: jogadores[1]?.nome || null,
            jogador3: jogadores[2]?.nome || null,
            jogador4: jogadores[3]?.nome || null,
            pontos: JSON.parse(quadra.pontos),
            quadra: quadra.quadra,
            rodada: quadra.rodada,
            status: quadra.status,
            nome: quadra.nome || null, // Novo campo "nome" adicionado na tabela "quadras"
          };

          entidadeObj.torneios.push(quadraObj);
        }
      }

      // Fetch esporte for each entidade
      const esporteEntidade = await getEsporte(torneios[0].id_esporte); // Buscar o esporte com base no primeiro torneio da entidade

      jsonData.dados.push({
        entidades: [entidadeObj],
        esporte: esporteEntidade,
      });
    }

    res.json(jsonData);
  } catch (err) {
    console.error("Erro ao buscar informações:", err);
    res.status(500).json({ error: "Erro ao buscar informações" });
  }
});

async function getEntidades() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM entidades", (err, entidades) => {
      if (err) {
        reject(err);
      } else {
        resolve(entidades);
      }
    });
  });
}

async function getTorneios(idEntidade) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM torneios WHERE id_entidade = ?",
      idEntidade,
      (err, torneios) => {
        if (err) {
          reject(err);
        } else {
          resolve(torneios);
        }
      }
    );
  });
}

async function getQuadras(idTorneio) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM quadras WHERE id_torneio = ?",
      idTorneio,
      (err, quadras) => {
        if (err) {
          reject(err);
        } else {
          resolve(quadras);
        }
      }
    );
  });
}

async function getJogadoresFromQuadra(quadra) {
  const jogadores = [];

  if (quadra.jogador1) {
    const jogador1 = await getJogador(quadra.jogador1);
    jogadores.push(jogador1);
  }

  if (quadra.jogador2) {
    const jogador2 = await getJogador(quadra.jogador2);
    jogadores.push(jogador2);
  }

  if (quadra.jogador3) {
    const jogador3 = await getJogador(quadra.jogador3);
    jogadores.push(jogador3);
  }

  if (quadra.jogador4) {
    const jogador4 = await getJogador(quadra.jogador4);
    jogadores.push(jogador4);
  }

  return jogadores;
}

async function getJogador(idJogador) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM jogadores WHERE id = ?",
      idJogador,
      (err, jogadores) => {
        if (err) {
          reject(err);
        } else {
          resolve(jogadores[0]);
        }
      }
    );
  });
}

async function getEsporte(idTorneio) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT esportes.nome FROM esportes JOIN torneios ON esportes.id = torneios.id_esporte WHERE torneios.id = ?",
      idTorneio,
      (err, esporte) => {
        if (err) {
          reject(err);
        } else {
          resolve(esporte[0].nome);
        }
      }
    );
  });
}

async function getEntidades() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM entidades", (err, entidades) => {
      if (err) {
        reject(err);
      } else {
        resolve(entidades);
      }
    });
  });
}

async function getTorneios(idEntidade) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM torneios WHERE id_entidade = ?",
      idEntidade,
      (err, torneios) => {
        if (err) {
          reject(err);
        } else {
          resolve(torneios);
        }
      }
    );
  });
}

async function getQuadras(idTorneio) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM quadras WHERE id_torneio = ?",
      idTorneio,
      (err, quadras) => {
        if (err) {
          reject(err);
        } else {
          resolve(quadras);
        }
      }
    );
  });
}

async function getJogadoresFromQuadra(quadra) {
  const jogadores = [];

  if (quadra.jogador1) {
    const jogador1 = await getJogador(quadra.jogador1);
    jogadores.push(jogador1);
  }

  if (quadra.jogador2) {
    const jogador2 = await getJogador(quadra.jogador2);
    jogadores.push(jogador2);
  }

  if (quadra.jogador3) {
    const jogador3 = await getJogador(quadra.jogador3);
    jogadores.push(jogador3);
  }

  if (quadra.jogador4) {
    const jogador4 = await getJogador(quadra.jogador4);
    jogadores.push(jogador4);
  }

  return jogadores;
}

async function getJogador(idJogador) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM jogadores WHERE id = ?",
      idJogador,
      (err, jogadores) => {
        if (err) {
          reject(err);
        } else {
          resolve(jogadores[0]);
        }
      }
    );
  });
}

async function getEsporte(idTorneio) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT esportes.nome FROM esportes JOIN torneios ON esportes.id = torneios.id_esporte WHERE torneios.id = ?",
      idTorneio,
      (err, esporte) => {
        if (err) {
          reject(err);
        } else {
          resolve(esporte[0].nome);
        }
      }
    );
  });
}

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
