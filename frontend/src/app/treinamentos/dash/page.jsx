"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/header";

const API = "/api";
const vazio = { nome: "", data_realizacao: "", data: "" };
const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
const em30Dias = new Date(hoje); em30Dias.setDate(hoje.getDate() + 30);
function estadoData(data) {
  if (!data) return "sem-data";
  const dia = new Date(`${data}T00:00:00`);
  return dia < hoje ? "vencido" : dia <= em30Dias ? "proximo" : "em-dia";
}
function formatarData(data) { return data ? new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR") : "—"; }

export default function Dashboard() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [modal, setModal] = useState(null);
  const [nome, setNome] = useState("");
  const [treinamentos, setTreinamentos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const [rFuncionarios, rCatalogo] = await Promise.all([fetch(`${API}/funcionarios`), fetch(`${API}/treinamentos`)]);
      if (!rFuncionarios.ok || !rCatalogo.ok) throw new Error("Falha ao carregar os dados.");
      setFuncionarios(await rFuncionarios.json()); setCatalogo(await rCatalogo.json()); setErro("");
    } catch { setErro("Não foi possível carregar os dados. Atualize a página e tente novamente."); }
    finally { setCarregando(false); }
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  const contagens = useMemo(() => {
    const todosTreinamentos = funcionarios.flatMap(f => f.treinamentos || []);
    return { total: todosTreinamentos.length, proximo: todosTreinamentos.filter(t => estadoData(t.data) === "proximo").length, vencido: todosTreinamentos.filter(t => estadoData(t.data) === "vencido").length };
  }, [funcionarios]);
  const lista = useMemo(() => funcionarios.filter(f => filtro === "todos" || (f.treinamentos || []).some(t => estadoData(t.data) === filtro)), [funcionarios, filtro]);

  function editar(f) { setNome(f.nome); setTreinamentos((f.treinamentos || []).map(t => ({ ...t }))); setModal({ tipo: "editar", funcionario: f }); setMensagem(""); setErro(""); }
  function atualizarTreinamento(index, campo, valor) { setTreinamentos(items => items.map((item, i) => i === index ? { ...item, [campo]: valor } : item)); }
  function selecionarTreinamento(index, id) {
    const treino = catalogo.find(item => String(item.id) === String(id));
    setTreinamentos(items => items.map((item, i) => i === index ? { ...item, treinamento_id: id ? Number(id) : null, nome: treino?.titulo || "" } : item));
  }
  async function confirmar() {
    if (!modal) return;
    try {
      const url = `${API}/funcionarios/${modal.funcionario.id}`;
      const options = modal.tipo === "excluir" ? { method: "DELETE" } : { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: nome.trim(), treinamentos }) };
      const response = await fetch(url, options); const result = await response.json();
      if (!response.ok) throw new Error(result.mensagem || "Não foi possível salvar.");
      setModal(null); setMensagem(modal.tipo === "excluir" ? "Funcionário excluído." : "Alterações salvas com sucesso."); await carregar();
    } catch (e) { setErro(e.message || "Não foi possível concluir a operação."); }
  }

  return <Header>
    <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4"><div><h1 className="h2 fw-bold mb-1">Dashboard</h1><p className="text-secondary mb-0">Acompanhe funcionários e vencimentos dos treinamentos.</p></div></div>
    {erro && <div className="alert alert-danger" role="alert">{erro}</div>}{mensagem && <div className="alert alert-success" role="status">{mensagem}</div>}
    <div className="row g-3 mb-4">
      {[{ label: "Funcionários", value: funcionarios.length, tone: "green" }, { label: "Treinamentos", value: contagens.total, tone: "blue" }, { label: "Próximos do vencimento", value: contagens.proximo, tone: "amber" }, { label: "Treinamentos vencidos", value: contagens.vencido, tone: "red" }].map(card => <div className="col-6 col-xl-3" key={card.label}><div className="dashboard-stat card border-0 shadow-sm h-100"><div className="card-body d-flex justify-content-between align-items-start"><div><div className="text-secondary small mb-2">{card.label}</div><div className="display-6 fw-bold">{card.value}</div></div><span className={`stat-mark ${card.tone}`} aria-hidden="true" /></div></div></div>)}
    </div>
    <section className="card border-0 shadow-sm"><div className="card-body p-3 p-md-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3"><div><h2 className="h5 fw-bold mb-1">Funcionários</h2><p className="text-secondary small mb-0">Consulte os treinamentos e suas datas de vencimento.</p></div><label className="d-flex align-items-center gap-2 small fw-semibold">Filtrar por vencimento<select className="form-select form-select-sm" value={filtro} onChange={e => setFiltro(e.target.value)}><option value="todos">Todos</option><option value="proximo">Próximos do vencimento</option><option value="vencido">Vencidos</option><option value="em-dia">Em dia</option></select></label></div>
      {carregando ? <p className="text-secondary">Carregando...</p> : lista.length === 0 ? <div className="empty-state"><p className="mb-0">{funcionarios.length ? "Nenhum funcionário corresponde a esse filtro." : "Nenhum funcionário cadastrado."}</p></div> : <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>Funcionário</th><th>Treinamento</th><th>Vencimento</th><th>Status</th><th className="text-end">Ações</th></tr></thead><tbody>{lista.map(f => { const principal = [...(f.treinamentos || [])].sort((a,b) => (a.data || "").localeCompare(b.data || ""))[0]; const status = estadoData(principal?.data); return <tr key={f.id}><td className="fw-semibold">{f.nome}</td><td>{principal?.nome || <span className="text-secondary">Nenhum treinamento</span>}{(f.treinamentos || []).length > 1 && <span className="small text-secondary ms-2">+{f.treinamentos.length - 1}</span>}</td><td>{formatarData(principal?.data)}</td><td>{principal && <span className={`status-pill ${status}`}>{status === "vencido" ? "Vencido" : status === "proximo" ? "Próximo" : "Em dia"}</span>}</td><td><div className="d-flex justify-content-end gap-2"><button className="btn btn-sm btn-outline-primary action-button" onClick={() => editar(f)}>Editar</button><button className="btn btn-sm btn-outline-danger action-button" onClick={() => setModal({ tipo: "excluir", funcionario: f })}>Excluir</button></div></td></tr>; })}</tbody></table></div>}
    </div></section>
    {modal && <div className="modal-backdrop-custom" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null); }}><div className={`modal-dialog modal-dialog-centered dashboard-modal ${modal.tipo === "editar" ? "edit-modal" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-titulo"><div className="modal-content">
      <div className={`modal-header ${modal.tipo === "excluir" ? "delete-modal-header" : ""}`}><div><span className="modal-kicker">{modal.tipo === "editar" ? "CADASTRO" : "CONFIRMAÇÃO"}</span><h2 className="modal-title fs-5 fw-bold" id="modal-titulo">{modal.tipo === "editar" ? "Editar funcionário" : "Excluir funcionário"}</h2></div><button className="btn-close" aria-label="Fechar" onClick={() => setModal(null)} /></div>
      {modal.tipo === "editar" ? <><div className="modal-body"><div className="mb-4"><label className="form-label fw-semibold" htmlFor="editar-nome">Nome do funcionário</label><input id="editar-nome" className="form-control" value={nome} onChange={e => setNome(e.target.value)} /></div><div className="d-flex align-items-center justify-content-between gap-2 mb-3"><h3 className="h6 fw-bold mb-0">Treinamentos e vencimentos</h3><button className="btn btn-sm btn-outline-success" onClick={() => setTreinamentos(items => [...items, { ...vazio }])}>+ Adicionar</button></div>{treinamentos.length === 0 && <p className="text-secondary small">Nenhum treinamento associado.</p>}<div className="d-flex flex-column gap-3">{treinamentos.map((t, i) => <div className="training-edit-row" key={t.id || `novo-${i}`}><label className="form-label small fw-semibold" htmlFor={`edit-treino-${i}`}>Treinamento</label><select id={`edit-treino-${i}`} className="form-select mb-2" value={t.treinamento_id || ""} onChange={e => selecionarTreinamento(i, e.target.value)}><option value="">Selecione um treinamento</option>{catalogo.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}</select>{!catalogo.length && <input className="form-control mb-2" aria-label="Nome do treinamento" placeholder="Nome do treinamento" value={t.nome} onChange={e => atualizarTreinamento(i,"nome",e.target.value)} />}<label className="form-label small fw-semibold" htmlFor={`edit-realizacao-${i}`}>Data realizada</label><input id={`edit-realizacao-${i}`} type="date" className="form-control mb-2" value={t.data_realizacao || ""} onChange={e => atualizarTreinamento(i,"data_realizacao",e.target.value)} /><label className="form-label small fw-semibold" htmlFor={`edit-data-${i}`}>Próxima data de vencimento</label><div className="d-flex gap-2"><input id={`edit-data-${i}`} type="date" className="form-control" value={t.data || ""} onChange={e => atualizarTreinamento(i,"data",e.target.value)} /><button className="btn btn-outline-danger" aria-label="Remover treinamento" onClick={() => setTreinamentos(items => items.filter((_, n) => n !== i))}>×</button></div></div>)}</div></div><div className="modal-footer"><button className="btn btn-light" onClick={() => setModal(null)}>Cancelar</button><button className="btn btn-primary px-4" disabled={!nome.trim() || treinamentos.some(t => !t.nome?.trim() || !t.data_realizacao || !t.data)} onClick={confirmar}>Salvar alterações</button></div></> : <><div className="modal-body"><div className="delete-warning-icon">!</div><p>Deseja excluir o funcionário <strong>{modal.funcionario.nome}</strong>?</p><p className="small text-secondary mb-0">Os treinamentos vinculados também serão removidos.</p></div><div className="modal-footer"><button className="btn btn-light" onClick={() => setModal(null)}>Manter funcionário</button><button className="btn btn-danger px-4" onClick={confirmar}>Excluir funcionário</button></div></>}
    </div></div></div>}
  </Header>;
}
