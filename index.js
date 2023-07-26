const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configurar o banco de dados
const connection = mysql.createPool({
    host: 'www.paulocruzautomacoes.com.br',
    user: 'paulo449_root',
    password: 'A)mU$YP]QL2c',
    database: 'paulo449_placar_ao_vivo',
    port: 3306,
    // protocol: 'TCP'
  });

// Configurar o banco de dados
const pool = mysql.createPool({
  host: 'www.paulocruzautomacoes.com.br',
  user: 'paulo449_root',
  password: 'A)mU$YP]QL2c',
  database: 'paulo449_placar_ao_vivo',
  port: 3306,
  connectionLimit: 10, // Definindo o limite máximo de conexões no pool
  connectTimeout: 5000, // Tempo máximo de espera para conectar (em milissegundos)
  acquireTimeout: 5000, // Tempo máximo de espera para obter uma conexão do pool (em milissegundos)
  waitForConnections: true, // Se true, o pool enfileira as conexões quando todas estiverem em uso
  queueLimit: 0, // Limite de tamanho da fila quando waitForConnections é verdadeiro (0 = ilimitado)
});

// Middleware
app.use(bodyParser.json());
app.use(cors());


// Rotas CRUD para a tabela 'jogadores'
app.get('/jogadores', (req, res) => {
  connection.query('SELECT * FROM jogadores', (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).json({ error: 'Erro ao buscar jogadores' });
      return;
    }
    res.json(results);
  });
  console.log(req)
});

app.post('/jogadores', (req, res) => {
  const jogador = req.body;
  connection.query('INSERT INTO jogadores SET ?', jogador, (err, result) => {
    if (err) {
      console.error('Erro ao executar a inserção:', err);
      res.status(500).json({ error: 'Erro ao adicionar jogador' });
      return;
    }
    res.json({ id: result.insertId, ...jogador });
  });
});

app.put('/jogadores/:id', (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query('UPDATE jogadores SET ? WHERE id = ?', [jogador, id], (err) => {
    if (err) {
      console.error('Erro ao executar a atualização:', err);
      res.status(500).json({ error: 'Erro ao atualizar jogador' });
      return;
    }
    res.json({ id, ...jogador });
  });
});

app.delete('/jogadores/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM jogadores WHERE id = ?', id, (err) => {
    if (err) {
      console.error('Erro ao executar a exclusão:', err);
      res.status(500).json({ error: 'Erro ao excluir jogador' });
      return;
    }
    res.json({ id });
  });
});

app.get('/jogadores', (req, res) => {
  connection.query('SELECT * FROM jogadores', (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).json({ error: 'Erro ao buscar jogadores' });
      return;
    }
    res.json(results);
  });
  console.log(req)
});

app.post('/jogadores', (req, res) => {
  const jogador = req.body;
  connection.query('INSERT INTO jogadores SET ?', jogador, (err, result) => {
    if (err) {
      console.error('Erro ao executar a inserção:', err);
      res.status(500).json({ error: 'Erro ao adicionar jogador' });
      return;
    }
    res.json({ id: result.insertId, ...jogador });
  });
});

app.put('/jogadores/:id', (req, res) => {
  const id = req.params.id;
  const jogador = req.body;
  connection.query('UPDATE jogadores SET ? WHERE id = ?', [jogador, id], (err) => {
    if (err) {
      console.error('Erro ao executar a atualização:', err);
      res.status(500).json({ error: 'Erro ao atualizar jogador' });
      return;
    }
    res.json({ id, ...jogador });
  });
});

app.delete('/jogadores/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM jogadores WHERE id = ?', id, (err) => {
    if (err) {
      console.error('Erro ao executar a exclusão:', err);
      res.status(500).json({ error: 'Erro ao excluir jogador' });
      return;
    }
    res.json({ id });
  });
});


// esportes

app.get('/entidades', (req, res) => {
    connection.query('SELECT * FROM entidades', (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta:', err);
        res.status(500).json({ error: 'Erro ao buscar entidades' });
        return;
      }
      res.json(results);
    });
    console.log(req)
  });
  
  app.post('/entidades', (req, res) => {
    const jogador = req.body;
    connection.query('INSERT INTO entidades SET ?', jogador, (err, result) => {
      if (err) {
        console.error('Erro ao executar a inserção:', err);
        res.status(500).json({ error: 'Erro ao adicionar jogador' });
        return;
      }
      res.json({ id: result.insertId, ...jogador });
    });
  });
  
  app.put('/entidades/:id', (req, res) => {
    const id = req.params.id;
    const jogador = req.body;
    connection.query('UPDATE entidades SET ? WHERE id = ?', [jogador, id], (err) => {
      if (err) {
        console.error('Erro ao executar a atualização:', err);
        res.status(500).json({ error: 'Erro ao atualizar jogador' });
        return;
      }
      res.json({ id, ...jogador });
    });
  });
  
  app.delete('/entidades/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM entidades WHERE id = ?', id, (err) => {
      if (err) {
        console.error('Erro ao executar a exclusão:', err);
        res.status(500).json({ error: 'Erro ao excluir jogador' });
        return;
      }
      res.json({ id });
    });
  });


  

// entidades 




  app.get('/esportes', (req, res) => {
    connection.query('SELECT * FROM esportes', (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta:', err);
        res.status(500).json({ error: 'Erro ao buscar esportes' });
        return;
      }
      res.json(results);
    });
    console.log(req)
  });
  
  app.post('/esportes', (req, res) => {
    const jogador = req.body;
    connection.query('INSERT INTO esportes SET ?', jogador, (err, result) => {
      if (err) {
        console.error('Erro ao executar a inserção:', err);
        res.status(500).json({ error: 'Erro ao adicionar jogador' });
        return;
      }
      res.json({ id: result.insertId, ...jogador });
    });
  });
  
  app.put('/esportes/:id', (req, res) => {
    const id = req.params.id;
    const jogador = req.body;
    connection.query('UPDATE esportes SET ? WHERE id = ?', [jogador, id], (err) => {
      if (err) {
        console.error('Erro ao executar a atualização:', err);
        res.status(500).json({ error: 'Erro ao atualizar jogador' });
        return;
      }
      res.json({ id, ...jogador });
    });
  });
  
  app.delete('/esportes/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM esportes WHERE id = ?', id, (err) => {
      if (err) {
        console.error('Erro ao executar a exclusão:', err);
        res.status(500).json({ error: 'Erro ao excluir jogador' });
        return;
      }
      res.json({ id });
    });
  });





  // torneios



  app.get('/torneios', (req, res) => {
    connection.query('SELECT * FROM torneios', (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta:', err);
        res.status(500).json({ error: 'Erro ao buscar torneios' });
        return;
      }
      res.json(results);
    });
    console.log(req)
  });
  
  app.post('/torneios', (req, res) => {
    const jogador = req.body;
    connection.query('INSERT INTO torneios SET ?', jogador, (err, result) => {
      if (err) {
        console.error('Erro ao executar a inserção:', err);
        res.status(500).json({ error: 'Erro ao adicionar jogador' });
        return;
      }
      res.json({ id: result.insertId, ...jogador });
    });
  });
  
  app.put('/torneios/:id', (req, res) => {
    const id = req.params.id;
    const jogador = req.body;
    connection.query('UPDATE torneios SET ? WHERE id = ?', [jogador, id], (err) => {
      if (err) {
        console.error('Erro ao executar a atualização:', err);
        res.status(500).json({ error: 'Erro ao atualizar jogador' });
        return;
      }
      res.json({ id, ...jogador });
    });
  });
  
  app.delete('/torneios/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM torneios WHERE id = ?', id, (err) => {
      if (err) {
        console.error('Erro ao executar a exclusão:', err);
        res.status(500).json({ error: 'Erro ao excluir jogador' });
        return;
      }
      res.json({ id });
    });
  });




  // quadras


  app.get('/quadras', (req, res) => {
    connection.query('SELECT * FROM quadras', (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta:', err);
        res.status(500).json({ error: 'Erro ao buscar quadras' });
        return;
      }
      res.json(results);
    });
    console.log(req)
  });
  
  app.post('/quadras', (req, res) => {
    const jogador = req.body;
    connection.query('INSERT INTO quadras SET ?', jogador, (err, result) => {
      if (err) {
        console.error('Erro ao executar a inserção:', err);
        res.status(500).json({ error: 'Erro ao adicionar jogador' });
        return;
      }
      res.json({ id: result.insertId, ...jogador });
    });
  });
  
  app.put('/quadras/:id', (req, res) => {
    const id = req.params.id;
    const jogador = req.body;
    connection.query('UPDATE quadras SET ? WHERE id = ?', [jogador, id], (err) => {
      if (err) {
        console.error('Erro ao executar a atualização:', err);
        res.status(500).json({ error: 'Erro ao atualizar jogador' });
        return;
      }
      res.json({ id, ...jogador });
    });
  });
  
  app.delete('/quadras/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM quadras WHERE id = ?', id, (err) => {
      if (err) {
        console.error('Erro ao executar a exclusão:', err);
        res.status(500).json({ error: 'Erro ao excluir jogador' });
        return;
      }
      res.json({ id });
    });
  });



  // Placar




  app.get('/placar', (req, res) => {
    connection.query('SELECT * FROM placar', (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta:', err);
        res.status(500).json({ error: 'Erro ao buscar placar' });
        return;
      }
      res.json(results);
    });
    console.log(req)
  });
  
  app.post('/placar', (req, res) => {
    const jogador = req.body;
    connection.query('INSERT INTO placar SET ?', jogador, (err, result) => {
      if (err) {
        console.error('Erro ao executar a inserção:', err);
        res.status(500).json({ error: 'Erro ao adicionar jogador' });
        return;
      }
      res.json({ id: result.insertId, ...jogador });
    });
  });
  
  app.put('/placar/:id', (req, res) => {
    const id = req.params.id;
    const jogador = req.body;
    connection.query('UPDATE placar SET ? WHERE id = ?', [jogador, id], (err) => {
      if (err) {
        console.error('Erro ao executar a atualização:', err);
        res.status(500).json({ error: 'Erro ao atualizar jogador' });
        return;
      }
      res.json({ id, ...jogador });
    });
  });
  
  app.delete('/placar/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM placar WHERE id = ?', id, (err) => {
      if (err) {
        console.error('Erro ao executar a exclusão:', err);
        res.status(500).json({ error: 'Erro ao excluir jogador' });
        return;
      }
      res.json({ id });
    });
  });
// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
