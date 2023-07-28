const express = require("express");
const mysql = require("mysql2/promise");
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
});

// Middleware
app.use(express.json());
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

// Rotas CRUD para a tabela 'jogadores'
const playersRouter = express.Router();

// ... Código da rota de jogadores ...

app.use("/jogadores", playersRouter);

// Rotas CRUD para a tabela 'entidades'
const entitiesRouter = express.Router();

// ... Código da rota de entidades ...

app.use("/entidades", entitiesRouter);

// Rotas CRUD para a tabela 'esportes'
const sportsRouter = express.Router();

// ... Código da rota de esportes ...

app.use("/esportes", sportsRouter);

// Rotas CRUD para a tabela 'torneios'
const tournamentsRouter = express.Router();

// ... Código da rota de torneios ...

app.use("/torneios", tournamentsRouter);

// Rotas CRUD para a tabela 'quadras'
const courtsRouter = express.Router();

// ... Código da rota de quadras ...

app.use("/quadras", courtsRouter);

// Rotas CRUD para a tabela 'placar'
const scoreboardRouter = express.Router();

// ... Código da rota de placar ...

app.use("/placar", scoreboardRouter);

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
  } catch (err) {
    handleErrors(res, err);
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
