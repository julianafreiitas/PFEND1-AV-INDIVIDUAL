const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;
const ARQUIVO_DADOS = path.resolve(__dirname, "../frontend/data/training-data.json");

function dadosIniciais() { return { treinamentos: [], funcionarios: [], proximoTreinamentoId: 1, proximoFuncionarioId: 1, proximoVinculoId: 1 }; }
function carregarDados() {
  try {
    const dados = JSON.parse(fs.readFileSync(ARQUIVO_DADOS, "utf8"));
    return { ...dadosIniciais(), ...dados, treinamentos: dados.treinamentos || [], funcionarios: dados.funcionarios || [] };
  } catch (error) {
    if (error.code !== "ENOENT") console.error("Arquivo de dados inválido; iniciando com dados vazios.", error.message);
    return dadosIniciais();
  }
}
let dados = carregarDados();
function salvarDados() {
  const temporario = `${ARQUIVO_DADOS}.tmp`;
  fs.writeFileSync(temporario, JSON.stringify(dados, null, 2), "utf8");
  fs.renameSync(temporario, ARQUIVO_DADOS);
}
function treinamentoValido({ titulo, carga_horaria, descricao }) {
  return typeof titulo === "string" && titulo.trim() && Number.isInteger(Number(carga_horaria)) && Number(carga_horaria) > 0 && typeof descricao === "string" && descricao.trim();
}
function dataValida(data) { return typeof data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data) && !Number.isNaN(Date.parse(`${data}T00:00:00`)); }
function funcionarioValido({ nome, treinamentos }) {
  return typeof nome === "string" && nome.trim() && Array.isArray(treinamentos) && treinamentos.every(t => typeof t.nome === "string" && t.nome.trim() && dataValida(t.data_realizacao) && dataValida(t.data));
}
function normalizarVinculos(treinamentos) {
  return treinamentos.map(t => ({
    id: t.id || dados.proximoVinculoId++,
    treinamento_id: t.treinamento_id ? Number(t.treinamento_id) : null,
    nome: t.nome.trim(),
    data_realizacao: t.data_realizacao,
    data: t.data,
  }));
}

app.get("/treinamentos", (_req, res) => res.json([...dados.treinamentos].sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"))));
app.get("/treinamentos/:id", (req, res) => {
  const treinamento = dados.treinamentos.find(item => item.id === Number(req.params.id));
  if (!treinamento) return res.status(404).json({ mensagem: "Treinamento não encontrado." });
  res.json(treinamento);
});
app.post("/treinamentos", (req, res) => {
  const { titulo, carga_horaria, descricao } = req.body;
  if (!treinamentoValido(req.body)) return res.status(400).json({ mensagem: "Preencha todos os campos corretamente." });
  const treinamento = { id: dados.proximoTreinamentoId++, titulo: titulo.trim(), carga_horaria: Number(carga_horaria), descricao: descricao.trim() };
  dados.treinamentos.push(treinamento); salvarDados();
  res.status(201).json({ mensagem: "Treinamento cadastrado com sucesso!", treinamento });
});
app.put("/treinamentos/:id", (req, res) => {
  const id = Number(req.params.id); const treinamento = dados.treinamentos.find(item => item.id === id);
  if (!treinamento) return res.status(404).json({ mensagem: "Treinamento não encontrado." });
  const { titulo, carga_horaria, descricao } = req.body;
  if (!treinamentoValido(req.body)) return res.status(400).json({ mensagem: "Preencha todos os campos corretamente." });
  Object.assign(treinamento, { titulo: titulo.trim(), carga_horaria: Number(carga_horaria), descricao: descricao.trim() });
  for (const funcionario of dados.funcionarios) for (const vinculo of funcionario.treinamentos) if (vinculo.treinamento_id === id) vinculo.nome = treinamento.titulo;
  salvarDados(); res.json({ mensagem: "Treinamento atualizado com sucesso!", treinamento });
});
app.delete("/treinamentos/:id", (req, res) => {
  const id = Number(req.params.id); const quantidade = dados.treinamentos.length;
  dados.treinamentos = dados.treinamentos.filter(item => item.id !== id);
  if (dados.treinamentos.length === quantidade) return res.status(404).json({ mensagem: "Treinamento não encontrado." });
  for (const funcionario of dados.funcionarios) for (const vinculo of funcionario.treinamentos) if (vinculo.treinamento_id === id) vinculo.treinamento_id = null;
  salvarDados(); res.json({ mensagem: "Treinamento excluído com sucesso!" });
});

app.get("/funcionarios", (_req, res) => res.json(dados.funcionarios));
app.post("/funcionarios", (req, res) => {
  const { nome, treinamentos } = req.body;
  if (!funcionarioValido({ nome, treinamentos })) return res.status(400).json({ mensagem: "Informe o nome, o treinamento, a data realizada e uma data de vencimento válida." });
  const funcionario = { id: dados.proximoFuncionarioId++, nome: nome.trim(), treinamentos: normalizarVinculos(treinamentos) };
  dados.funcionarios.push(funcionario); salvarDados();
  res.status(201).json({ mensagem: "Funcionário cadastrado com sucesso!", funcionario });
});
app.put("/funcionarios/:id", (req, res) => {
  const id = Number(req.params.id); const funcionario = dados.funcionarios.find(item => item.id === id);
  if (!funcionario) return res.status(404).json({ mensagem: "Funcionário não encontrado." });
  const { nome, treinamentos } = req.body;
  if (!funcionarioValido({ nome, treinamentos })) return res.status(400).json({ mensagem: "Informe o nome, o treinamento, a data realizada e uma data de vencimento válida." });
  funcionario.nome = nome.trim(); funcionario.treinamentos = normalizarVinculos(treinamentos); salvarDados();
  res.json({ mensagem: "Funcionário atualizado com sucesso!", funcionario });
});
app.delete("/funcionarios/:id", (req, res) => {
  const id = Number(req.params.id); const quantidade = dados.funcionarios.length;
  dados.funcionarios = dados.funcionarios.filter(item => item.id !== id);
  if (dados.funcionarios.length === quantidade) return res.status(404).json({ mensagem: "Funcionário não encontrado." });
  salvarDados(); res.json({ mensagem: "Funcionário excluído com sucesso!" });
});

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}; dados em ${ARQUIVO_DADOS}`));
