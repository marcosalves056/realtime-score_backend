const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Configurar o banco de dados com pool de conexões
const pool = mysql.createPool({
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

// Função utilitária para executar consultas SQL com pool de conexões
const executeQuery = async (query, params) => {
  const connection = await pool.getConnection();
  try {
    return await connection.query(query, params);
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

// Função utilitária para tratar erros e enviar resposta de erro
const handleErrors = (res, err) => {
  console.error("Erro ao executar consulta:", err);
  res.status(500).json({ error: "Erro ao buscar informações" });
};

// Rota para retornar os dados formatados conforme a necessidade
app.get("/dados", async (req, res) => {
  try {
    const jsonData = {
      dados: [],
    };

    // Fetch entidades from the database
    const [entidades] = await executeQuery("SELECT * FROM entidades");

    const fetchTorneios = async (entidadeId) => {
      const [results] = await executeQuery(
        "SELECT * FROM torneios WHERE id_entidade = ?",
        entidadeId
      );
      return results;
    };

    const fetchQuadras = async (torneioId) => {
      const [results] = await executeQuery(
        "SELECT * FROM quadras WHERE id_torneio = ?",
        torneioId
      );
      return results;
    };

    const fetchEsporte = async (torneio) => {
      const [results] = await executeQuery(
        "SELECT nome FROM esportes WHERE id = ?",
        torneio.id_esporte
      );
      return results[0]?.nome || "";
    };

    const fetchPlayerName = async (playerId) => {
      const [results] = await executeQuery(
        "SELECT nome FROM jogadores WHERE id = ?",
        [playerId]
      );
      return results[0]?.nome || "";
    };

    const fetchEntidadesAndBuildJson = async () => {
      for (const entidade of entidades) {
        const entidadeObj = {
          nome_entidade: entidade.nome,
          torneios: [],
        };
        const torneios = await fetchTorneios(entidade.id);

        for (const torneio of torneios) {
          const quadras = [];

          const quadrasData = await fetchQuadras(torneio.id);

          for (const quadra of quadrasData) {
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
              estado: quadra.status,
            };

            quadras.push(quadraObj);
          }

          entidadeObj.torneios.push({
            nome_torneio: torneio.nome,
            quadras: quadras,
          });
        }

        jsonData.dados.push({
          esporte: await fetchEsporte(torneios[0]),
          entidades: [entidadeObj],
        });
      }

      res.json(jsonData);
    };

    await fetchEntidadesAndBuildJson();
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rotas CRUD para a tabela 'jogadores'
const playersRouter = express.Router();
playersRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const [jogadores] = await executeQuery("SELECT * FROM jogadores");
      res.json(jogadores);
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .post(async (req, res) => {
    try {
      const { nome, idade, posicao } = req.body;
      await executeQuery(
        "INSERT INTO jogadores (nome, idade, posicao) VALUES (?, ?, ?)",
        [nome, idade, posicao]
      );
      res.status(201).json({ message: "Jogador criado com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });

playersRouter
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const [jogador] = await executeQuery(
        "SELECT * FROM jogadores WHERE id = ?",
        [id]
      );
      if (jogador.length === 0) {
        res.status(404).json({ error: "Jogador não encontrado" });
      } else {
        res.json(jogador[0]);
      }
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const { nome, idade, posicao } = req.body;
      await executeQuery(
        "UPDATE jogadores SET nome = ?, idade = ?, posicao = ? WHERE id = ?",
        [nome, idade, posicao, id]
      );
      res.json({ message: "Jogador atualizado com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await executeQuery("DELETE FROM jogadores WHERE id = ?", [id]);
      res.json({ message: "Jogador excluído com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });

app.use("/jogadores", playersRouter);

// Repita o padrão acima para as rotas CRUD das outras tabelas: 'entidades', 'esportes', 'torneios', 'quadras' e 'placar'

// Rotas CRUD para a tabela 'esportes'
const esportesRouter = express.Router();
esportesRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const [esportes] = await executeQuery("SELECT * FROM esportes");
      res.json(esportes);
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .post(async (req, res) => {
    try {
      const { nome } = req.body;
      await executeQuery("INSERT INTO esportes (nome) VALUES (?)", [nome]);
      res.status(201).json({ message: "Esporte criado com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });

esportesRouter
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const [esporte] = await executeQuery(
        "SELECT * FROM esportes WHERE id = ?",
        [id]
      );
      if (esporte.length === 0) {
        res.status(404).json({ error: "Esporte não encontrado" });
      } else {
        res.json(esporte[0]);
      }
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const { nome } = req.body;
      await executeQuery("UPDATE esportes SET nome = ? WHERE id = ?", [
        nome,
        id,
      ]);
      res.json({ message: "Esporte atualizado com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await executeQuery("DELETE FROM esportes WHERE id = ?", [id]);
      res.json({ message: "Esporte excluído com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });

app.use("/esportes", esportesRouter);

// Repita o padrão acima para as rotas CRUD das outras tabelas: 'entidades', 'torneios', 'quadras' e 'placar'

// Rotas CRUD para a tabela 'entidades'
const entidadesRouter = express.Router();
entidadesRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const [entidades] = await executeQuery("SELECT * FROM entidades");
      res.json(entidades);
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .post(async (req, res) => {
    try {
      const { nome } = req.body;
      await executeQuery("INSERT INTO entidades (nome) VALUES (?)", [nome]);
      res.status(201).json({ message: "Entidade criada com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });

entidadesRouter
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const [entidade] = await executeQuery(
        "SELECT * FROM entidades WHERE id = ?",
        [id]
      );
      if (entidade.length === 0) {
        res.status(404).json({ error: "Entidade não encontrada" });
      } else {
        res.json(entidade[0]);
      }
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const { nome } = req.body;
      await executeQuery("UPDATE entidades SET nome = ? WHERE id = ?", [
        nome,
        id,
      ]);
      res.json({ message: "Entidade atualizada com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await executeQuery("DELETE FROM entidades WHERE id = ?", [id]);
      res.json({ message: "Entidade excluída com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });

app.use("/entidades", entidadesRouter);

// Rotas CRUD para a tabela 'torneios'
const torneiosRouter = express.Router();
torneiosRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const [torneios] = await executeQuery("SELECT * FROM torneios");
      res.json(torneios);
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .post(async (req, res) => {
    try {
      const { id_entidade, id_esporte, nome } = req.body;
      await executeQuery(
        "INSERT INTO torneios (id_entidade, id_esporte, nome) VALUES (?, ?, ?)",
        [id_entidade, id_esporte, nome]
      );
      res.status(201).json({ message: "Torneio criado com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });

torneiosRouter
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const [torneio] = await executeQuery(
        "SELECT * FROM torneios WHERE id = ?",
        [id]
      );
      if (torneio.length === 0) {
        res.status(404).json({ error: "Torneio não encontrado" });
      } else {
        res.json(torneio[0]);
      }
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const { id_entidade, id_esporte, nome } = req.body;
      await executeQuery(
        "UPDATE torneios SET id_entidade = ?, id_esporte = ?, nome = ? WHERE id = ?",
        [id_entidade, id_esporte, nome, id]
      );
      res.json({ message: "Torneio atualizado com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await executeQuery("DELETE FROM torneios WHERE id = ?", [id]);
      res.json({ message: "Torneio excluído com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });

app.use("/torneios", torneiosRouter);

// Repita o padrão acima para as rotas CRUD das outras tabelas: 'quadras' e 'placar'

// Rotas CRUD para a tabela 'quadras'
app.post("/quadras", async (req, res) => {
  try {
    const quadra = req.body;
    const query =
      "INSERT INTO quadras (id_torneio, games, pontos, jogador1, jogador2, jogador3, jogador4, status, categoria, rodada, quadra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [
      quadra.id_torneio,
      quadra.games,
      quadra.pontos,
      quadra.jogador1,
      quadra.jogador2,
      quadra.jogador3,
      quadra.jogador4,
      quadra.status,
      quadra.categoria,
      quadra.rodada,
      quadra.quadra,
    ];

    const [result] = await executeQuery(query, params);
    const newQuadraId = result.insertId;
    const newQuadra = { id: newQuadraId, ...quadra };
    res.json(newQuadra);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rota para atualizar uma quadra existente
app.put("/quadras/:id", async (req, res) => {
  try {
    const quadraId = req.params.id;
    const quadra = req.body;
    const query =
      "UPDATE quadras SET id_torneio = ?, games = ?, pontos = ?, jogador1 = ?, jogador2 = ?, jogador3 = ?, jogador4 = ?, status = ?, categoria = ?, rodada = ?, quadra = ? WHERE id = ?";
    const params = [
      quadra.id_torneio,
      quadra.games,
      quadra.pontos,
      quadra.jogador1,
      quadra.jogador2,
      quadra.jogador3,
      quadra.jogador4,
      quadra.status,
      quadra.categoria,
      quadra.rodada,
      quadra.quadra,
      quadraId,
    ];

    await executeQuery(query, params);
    res.json({ id: quadraId, ...quadra });
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rota para buscar uma quadra pelo ID
app.get("/quadras/:id", async (req, res) => {
  try {
    const quadraId = req.params.id;
    const [results] = await executeQuery(
      "SELECT * FROM quadras WHERE id = ?",
      quadraId
    );
    const quadra = results[0];
    if (!quadra) {
      res.status(404).json({ error: "Quadra não encontrada" });
      return;
    }
    res.json(quadra);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rota para listar todas as quadras
app.get("/quadras", async (req, res) => {
  try {
    const [results] = await executeQuery("SELECT * FROM quadras");
    res.json(results);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rota para excluir uma quadra pelo ID
app.delete("/quadras/:id", async (req, res) => {
  try {
    const quadraId = req.params.id;
    await executeQuery("DELETE FROM quadras WHERE id = ?", quadraId);
    res.json({ id: quadraId });
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rotas CRUD para a tabela 'placar'
const placarRouter = express.Router();
placarRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const [placar] = await executeQuery("SELECT * FROM placar");
      res.json(placar);
    } catch (err) {
      handleErrors(res, err);
    }
  })
  .post(async (req, res) => {
    try {
      const { id_quadra, set1, set2, set3, set4, set5 } = req.body;
      await executeQuery(
        "INSERT INTO placar (id_quadra, set1, set2, set3, set4, set5) VALUES (?, ?, ?, ?, ?, ?)",
        [
          id_quadra,
          JSON.stringify(set1),
          JSON.stringify(set2),
          JSON.stringify(set3),
          JSON.stringify(set4),
          JSON.stringify(set5),
        ]
      );
      res.status(201).json({ message: "Placar criado com sucesso" });
    } catch (err) {
      handleErrors(res, err);
    }
  });
app.post("/placar", async (req, res) => {
  try {
    const placar = req.body;
    const query =
      "INSERT INTO placar (controle_mais_1, controle_reset_1, controle_menos_1, controle_mais_2, controle_reset_2, controle_menos_2, painel_ip, id_torneio, id_quadra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [
      placar.controle_mais_1,
      placar.controle_reset_1,
      placar.controle_menos_1,
      placar.controle_mais_2,
      placar.controle_reset_2,
      placar.controle_menos_2,
      placar.painel_ip,
      placar.id_torneio,
      placar.id_quadra,
    ];

    const [result] = await executeQuery(query, params);
    const newPlacarId = result.insertId;
    const newPlacar = { id: newPlacarId, ...placar };
    res.json(newPlacar);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rota para atualizar um placar existente
app.put("/placar/:id", async (req, res) => {
  try {
    const placarId = req.params.id;
    const placar = req.body;
    const query =
      "UPDATE placar SET controle_mais_1 = ?, controle_reset_1 = ?, controle_menos_1 = ?, controle_mais_2 = ?, controle_reset_2 = ?, controle_menos_2 = ?, painel_ip = ?, id_torneio = ?, id_quadra = ? WHERE id = ?";
    const params = [
      placar.controle_mais_1,
      placar.controle_reset_1,
      placar.controle_menos_1,
      placar.controle_mais_2,
      placar.controle_reset_2,
      placar.controle_menos_2,
      placar.painel_ip,
      placar.id_torneio,
      placar.id_quadra,
      placarId,
    ];

    await executeQuery(query, params);
    res.json({ id: placarId, ...placar });
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rota para buscar um placar pelo ID
app.get("/placar/:id", async (req, res) => {
  try {
    const placarId = req.params.id;
    const [results] = await executeQuery(
      "SELECT * FROM placar WHERE id = ?",
      placarId
    );
    const placar = results[0];
    if (!placar) {
      res.status(404).json({ error: "Placar não encontrado" });
      return;
    }
    res.json(placar);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rota para listar todos os placares
app.get("/placar", async (req, res) => {
  try {
    const [results] = await executeQuery("SELECT * FROM placar");
    res.json(results);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Rota para excluir um placar pelo ID
app.delete("/placar/:id", async (req, res) => {
  try {
    const placarId = req.params.id;
    await executeQuery("DELETE FROM placar WHERE id = ?", placarId);
    res.json({ id: placarId });
  } catch (err) {
    handleErrors(res, err);
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
