import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "data", "training-data.json");
const emptyData = () => ({ treinamentos: [], funcionarios: [], proximoTreinamentoId: 1, proximoFuncionarioId: 1, proximoVinculoId: 1 });

function readData() {
  try {
    const parsed = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    return { ...emptyData(), ...parsed, treinamentos: parsed.treinamentos || [], funcionarios: parsed.funcionarios || [] };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return emptyData();
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  const tempPath = `${dataPath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempPath, dataPath);
}

function json(body, status = 200) { return Response.json(body, { status }); }
function isDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function validTraining(body) {
  return typeof body?.titulo === "string" && body.titulo.trim() && Number.isInteger(Number(body.carga_horaria)) && Number(body.carga_horaria) > 0 && typeof body.descricao === "string" && body.descricao.trim();
}
function validEmployee(body) {
  return typeof body?.nome === "string" && body.nome.trim() && Array.isArray(body.treinamentos) && body.treinamentos.every(t => typeof t.nome === "string" && t.nome.trim() && isDate(t.data_realizacao) && isDate(t.data));
}
async function resourceFrom(context) { return (await context.params).resource || []; }
function formatTraining(body, id) {
  return { id, titulo: body.titulo.trim(), carga_horaria: Number(body.carga_horaria), descricao: body.descricao.trim() };
}
function formatLinks(items, data) {
  return items.map(item => ({
    id: item.id || data.proximoVinculoId++,
    treinamento_id: item.treinamento_id ? Number(item.treinamento_id) : null,
    nome: item.nome.trim(), data_realizacao: item.data_realizacao, data: item.data,
  }));
}

export async function GET(_request, context) {
  const resource = await resourceFrom(context);
  const data = readData();
  if (resource[0] === "treinamentos" && resource.length === 1) return json([...data.treinamentos].sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR")));
  if (resource[0] === "treinamentos" && resource.length === 2) {
    const item = data.treinamentos.find(training => training.id === Number(resource[1]));
    return item ? json(item) : json({ mensagem: "Treinamento não encontrado." }, 404);
  }
  if (resource[0] === "funcionarios" && resource.length === 1) return json(data.funcionarios);
  return json({ mensagem: "Rota não encontrada." }, 404);
}

export async function POST(request, context) {
  const resource = await resourceFrom(context);
  const body = await request.json().catch(() => null);
  const data = readData();
  if (resource.length === 1 && resource[0] === "treinamentos") {
    if (!validTraining(body)) return json({ mensagem: "Preencha todos os campos corretamente." }, 400);
    const training = formatTraining(body, data.proximoTreinamentoId++);
    data.treinamentos.push(training); writeData(data);
    return json({ mensagem: "Treinamento cadastrado com sucesso!", treinamento: training }, 201);
  }
  if (resource.length === 1 && resource[0] === "funcionarios") {
    if (!validEmployee(body)) return json({ mensagem: "Informe o nome, o treinamento, a data realizada e uma data de vencimento válida." }, 400);
    const employee = { id: data.proximoFuncionarioId++, nome: body.nome.trim(), treinamentos: formatLinks(body.treinamentos, data) };
    data.funcionarios.push(employee); writeData(data);
    return json({ mensagem: "Funcionário cadastrado com sucesso!", funcionario: employee }, 201);
  }
  return json({ mensagem: "Rota não encontrada." }, 404);
}

export async function PUT(request, context) {
  const resource = await resourceFrom(context);
  const body = await request.json().catch(() => null);
  const data = readData();
  if (resource.length !== 2) return json({ mensagem: "Rota não encontrada." }, 404);
  const id = Number(resource[1]);
  if (resource[0] === "treinamentos") {
    const training = data.treinamentos.find(item => item.id === id);
    if (!training) return json({ mensagem: "Treinamento não encontrado." }, 404);
    if (!validTraining(body)) return json({ mensagem: "Preencha todos os campos corretamente." }, 400);
    Object.assign(training, formatTraining(body, id));
    for (const employee of data.funcionarios) for (const link of employee.treinamentos) if (link.treinamento_id === id) link.nome = training.titulo;
    writeData(data); return json({ mensagem: "Treinamento atualizado com sucesso!", treinamento: training });
  }
  if (resource[0] === "funcionarios") {
    const employee = data.funcionarios.find(item => item.id === id);
    if (!employee) return json({ mensagem: "Funcionário não encontrado." }, 404);
    if (!validEmployee(body)) return json({ mensagem: "Informe o nome, o treinamento, a data realizada e uma data de vencimento válida." }, 400);
    employee.nome = body.nome.trim(); employee.treinamentos = formatLinks(body.treinamentos, data);
    writeData(data); return json({ mensagem: "Funcionário atualizado com sucesso!", funcionario: employee });
  }
  return json({ mensagem: "Rota não encontrada." }, 404);
}

export async function DELETE(_request, context) {
  const resource = await resourceFrom(context);
  const data = readData();
  if (resource.length !== 2) return json({ mensagem: "Rota não encontrada." }, 404);
  const id = Number(resource[1]);
  if (resource[0] === "treinamentos") {
    const count = data.treinamentos.length;
    data.treinamentos = data.treinamentos.filter(item => item.id !== id);
    if (count === data.treinamentos.length) return json({ mensagem: "Treinamento não encontrado." }, 404);
    for (const employee of data.funcionarios) for (const link of employee.treinamentos) if (link.treinamento_id === id) link.treinamento_id = null;
    writeData(data); return json({ mensagem: "Treinamento excluído com sucesso!" });
  }
  if (resource[0] === "funcionarios") {
    const count = data.funcionarios.length;
    data.funcionarios = data.funcionarios.filter(item => item.id !== id);
    if (count === data.funcionarios.length) return json({ mensagem: "Funcionário não encontrado." }, 404);
    writeData(data); return json({ mensagem: "Funcionário excluído com sucesso!" });
  }
  return json({ mensagem: "Rota não encontrada." }, 404);
}
