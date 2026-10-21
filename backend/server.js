
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

let proximoId = 3;

let treinamentos = [
  {
    id: 1,
    titulo: "Segurança no Trabalho",
    carga_horaria: 8,
    data_realizacao: "2026-10-10",
    descricao: "Orientações de segurança no ambiente de trabalho."
  },
  {
    id: 2,
    titulo: "Uso de Equipamentos de Proteção",
    carga_horaria: 4,
    data_realizacao: "2026-10-15",
    descricao: "Orientações sobre o uso correto de EPIs."
  }
];

// Listar
app.get("/treinamentos", (req, res) => {
  res.json(treinamentos);
});

// Buscar um registro
app.get("/treinamentos/:id", (req, res) => {
  const treinamento = treinamentos.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!treinamento) {
    return res.status(404).json({
      mensagem: "Treinamento não encontrado."
    });
  }

  res.json(treinamento);
});

// Cadastrar
app.post("/treinamentos", (req, res) => {
  const { titulo, carga_horaria, data_realizacao, descricao } = req.body;

  if (
    typeof titulo !== "string" || !titulo.trim() ||
    !Number.isInteger(Number(carga_horaria)) ||
    Number(carga_horaria) <= 0 ||
    typeof data_realizacao !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data_realizacao) ||
    typeof descricao !== "string" || !descricao.trim()
  ) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos corretamente."
    });
  }

  const novo = {
    id: proximoId++,
    titulo: titulo.trim(),
    carga_horaria: Number(carga_horaria),
    data_realizacao,
    descricao: descricao.trim()
  };

  treinamentos.push(novo);

  res.status(201).json({
    mensagem: "Treinamento cadastrado com sucesso!",
    treinamento: novo
  });
});

// Editar
app.put("/treinamentos/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = treinamentos.findIndex(
    (item) => item.id === id
  );

  if (indice === -1) {
    return res.status(404).json({
      mensagem: "Treinamento não encontrado."
    });
  }

  const { titulo, carga_horaria, data_realizacao, descricao } = req.body;

  if (
    typeof titulo !== "string" || !titulo.trim() ||
    !Number.isInteger(Number(carga_horaria)) ||
    Number(carga_horaria) <= 0 ||
    typeof data_realizacao !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data_realizacao) ||
    typeof descricao !== "string" || !descricao.trim()
  ) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos corretamente."
    });
  }

  treinamentos[indice] = {
    id,
    titulo: titulo.trim(),
    carga_horaria: Number(carga_horaria),
    data_realizacao,
    descricao: descricao.trim()
  };

  res.json({
    mensagem: "Treinamento atualizado com sucesso!",
    treinamento: treinamentos[indice]
  });
});

// Excluir
app.delete("/treinamentos/:id", (req, res) => {
  const id = Number(req.params.id);

  const quantidadeAntes = treinamentos.length;

  treinamentos = treinamentos.filter(
    (item) => item.id !== id
  );

  if (treinamentos.length === quantidadeAntes) {
    return res.status(404).json({
      mensagem: "Treinamento não encontrado."
    });
  }

  res.json({
    mensagem: "Treinamento excluído com sucesso!"
  });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
