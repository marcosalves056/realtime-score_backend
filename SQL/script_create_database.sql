CREATE TABLE jogadores (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255),
  ultima_categoria VARCHAR(255),
  dt_nascimento DATE,
  cidade VARCHAR(255),
  estado VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE esportes (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE entidades (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE torneios (
  id INT NOT NULL AUTO_INCREMENT,
  id_esporte INT NOT NULL,
  id_entidade INT NOT NULL,
  nome VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (id_esporte) REFERENCES esportes (id),
  FOREIGN KEY (id_entidade) REFERENCES entidades (id)
);

CREATE TABLE quadras (
  id INT NOT NULL AUTO_INCREMENT,
  id_torneio INT NOT NULL,
  games JSON,
  pontos JSON,
  jogador1 INT,
  jogador2 INT,
  jogador3 INT,
  jogador4 INT,
  status VARCHAR(255),
  categoria VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (id_torneio) REFERENCES torneios (id),
  FOREIGN KEY (jogador1) REFERENCES jogadores (id),
  FOREIGN KEY (jogador2) REFERENCES jogadores (id),
  FOREIGN KEY (jogador3) REFERENCES jogadores (id),
  FOREIGN KEY (jogador4) REFERENCES jogadores (id)
);

CREATE TABLE placar (
  id INT NOT NULL AUTO_INCREMENT,
  controle_mais_1 VARCHAR(255),
  controle_reset_1 VARCHAR(255),
  controle_menos_1 VARCHAR(255),
  controle_mais_2 VARCHAR(255),
  controle_reset_2 VARCHAR(255),
  controle_menos_2 VARCHAR(255),
  painel_ip VARCHAR(255),
  id_torneio INT,
  PRIMARY KEY (id),
  FOREIGN KEY (id_torneio) REFERENCES torneios (id)
);

INSERT INTO jogadores (nome, ultima_categoria, dt_nascimento, cidade, estado) VALUES
('José Maria', 'Amador', '2001-12-12', 'Fortaleza', 'CE'),
('João Paulo', 'Amador', '1999-10-10', 'Recife', 'PE'),
('Maria José', 'Profissional', '2000-11-11', 'Natal', 'RN'),
('João da Silva', 'Amador', '1990-01-01', 'São Paulo', 'SP'),
('Maria da Silva', 'Profissional', '1991-02-02', 'Rio de Janeiro', 'RJ'),
('José da Silva', 'Amador', '1992-03-03', 'Belo Horizonte', 'MG'),
('Pedro', 'Amador', '1993-04-04', 'Brasília', 'DF'),
('Maria', 'Profissional', '1994-05-05', 'São Paulo', 'SP'),
('José', 'Amador', '1995-06-06', 'Rio de Janeiro', 'RJ'),
('João', 'Amador', '1996-07-07', 'Porto Alegre', 'RS'),
('Mariana', 'Profissional', '1997-08-08', 'Curitiba', 'PR'),
('José Carlos', 'Amador', '1998-09-09', 'Salvador', 'BA');

INSERT INTO esportes (nome) VALUES
('Futebol'),
('Basquete'),
('Vôlei');

INSERT INTO entidades (nome) VALUES
('Federação Paulista de Futebol'),
('Federação Carioca de Basquete'),
('Federação Mineira de Vôlei');

INSERT INTO torneios (id_esporte, id_entidade, nome) VALUES
(1, 1, 'Campeonato Paulista de Futebol'),
(2, 2, 'Campeonato Carioca de Basquete'),
(3, 3, 'Campeonato Mineiro de Vôlei');

INSERT INTO quadras (id_torneio, games, pontos, jogador1, jogador2, jogador3, jogador4, status, categoria) VALUES
(1, '{ "jogo1": 10, "jogo2": 20, "jogo3": 30 }', '{ "ponto1": 100, "ponto2": 200, "ponto3": 300 }', 1, 2, 3, 4, 'Ativo', 'Amador'),
(2, '{ "jogo1": 10, "jogo2": 20, "jogo3": 30 }', '{ "ponto1": 100, "ponto2": 200, "ponto3": 300 }', 5, 6, 7, 8, 'Ativo', 'Profissional'),
(3, '{ "jogo1": 10, "jogo2": 20, "jogo3": 30 }', '{ "ponto1": 100, "ponto2": 200, "ponto3": 300 }', 9, 10, 11, 12, 'Ativo', 'Amador');

INSERT INTO placar (id, controle_mais_1, controle_reset_1, controle_menos_1, controle_mais_2, controle_reset_2, controle_menos_2, painel_ip, id_torneio) VALUES
(1, 1, 2, 3, 4, 5, 6, '192.168.1.1', 1),
(2, 7, 8, 9, 10, 11, 12, '192.168.1.2', 2),
(3, 13, 14, 15, 16, 17, 18, '192.168.1.3', 3);
