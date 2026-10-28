"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/header";

const API = "/api";
const treinamentoVazio = { treinamento_id: "", nome: "", data_realizacao: "", data: "" };

export default function CadastroFuncionario() {
  const [nome, setNome] = useState("");
  const [catalogo, setCatalogo] = useState([]);
  const [treinamentos, setTreinamentos] = useState([{ ...treinamentoVazio }]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`${API}/treinamentos`).then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setCatalogo).catch(() => setErro("Não foi possível carregar os treinamentos. Atualize a página e tente novamente."));
  }, []);

  function atualizarTreinamento(index, campo, valor) {
    setTreinamentos(atual => atual.map((item, i) => {
      if (i !== index) return item;
      if (campo === "treinamento_id") {
        const escolhido = catalogo.find(t => String(t.id) === valor);
        return { ...item, treinamento_id: valor ? Number(valor) : "", nome: escolhido?.titulo || "" };
      }
      return { ...item, [campo]: valor };
    }));
  }

  async function salvar(event) {
    event.preventDefault(); setMensagem(""); setErro("");
    const dadosTreinamentos = treinamentos.map(item => ({ treinamento_id: item.treinamento_id || null, nome: item.nome.trim(), data_realizacao: item.data_realizacao, data: item.data }));
    if (!nome.trim() || dadosTreinamentos.some(item => !item.nome || !item.data_realizacao || !item.data)) {
      setErro("Preencha o nome, o treinamento, a data de realização e a próxima data de vencimento."); return;
    }
    try {
      const response = await fetch(`${API}/funcionarios`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: nome.trim(), treinamentos: dadosTreinamentos }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.mensagem || "Não foi possível cadastrar o funcionário.");
      setNome(""); setTreinamentos([{ ...treinamentoVazio }]); setMensagem("Funcionário cadastrado com sucesso.");
    } catch (e) { setErro(e.message || "Não foi possível salvar os dados. Tente novamente."); }
  }

  return <Header><main className="employee-page">
    <div className="text-center mb-4"><h1 className="h2 fw-bold mb-1">Cadastrar funcionário</h1><p className="text-secondary mb-0">Adicione os treinamentos e acompanhe suas datas de realização e vencimento.</p></div>
    <section className="card border-0 shadow-sm employee-form-card"><div className="card-body p-4 p-md-5">
      {mensagem && <div className="alert alert-success" role="status">{mensagem}</div>}{erro && <div className="alert alert-danger" role="alert">{erro}</div>}
      <form onSubmit={salvar}>
        <div className="mb-4"><label htmlFor="nome-funcionario" className="form-label fw-semibold">Nome do funcionário</label><input id="nome-funcionario" className="form-control form-control-lg" value={nome} onChange={e => setNome(e.target.value)} required maxLength={120} placeholder="Ex.: Maria da Silva" /></div>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3"><div><h2 className="h5 fw-bold mb-1">Treinamentos</h2><p className="small text-secondary mb-0">Informe quando foi realizado e a próxima data de vencimento.</p></div><button type="button" className="btn btn-outline-success" onClick={() => setTreinamentos(atual => [...atual, { ...treinamentoVazio }])}>+ Adicionar treinamento</button></div>
        <div className="d-flex flex-column gap-3">{treinamentos.map((item, index) => <div className="employee-training-card" key={index}><div className="row g-3 align-items-end">
          <div className="col-12 col-md-5"><label htmlFor={`treinamento-${index}`} className="form-label fw-semibold">Treinamento</label>{catalogo.length ? <select id={`treinamento-${index}`} className="form-select" value={item.treinamento_id} onChange={e => atualizarTreinamento(index, "treinamento_id", e.target.value)} required><option value="">Selecione um treinamento</option>{catalogo.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}</select> : <input id={`treinamento-${index}`} className="form-control" value={item.nome} onChange={e => atualizarTreinamento(index, "nome", e.target.value)} placeholder="Nome do treinamento" required />}</div>
          <div className="col-12 col-md-3"><label htmlFor={`realizacao-${index}`} className="form-label fw-semibold">Data realizada</label><input id={`realizacao-${index}`} type="date" className="form-control" value={item.data_realizacao} onChange={e => atualizarTreinamento(index, "data_realizacao", e.target.value)} required /></div>
          <div className="col-12 col-md-3"><label htmlFor={`data-${index}`} className="form-label fw-semibold">Próxima data de vencimento</label><input id={`data-${index}`} type="date" className="form-control" value={item.data} onChange={e => atualizarTreinamento(index, "data", e.target.value)} required /></div>
          <div className="col-12 col-md-1 d-grid"><button type="button" className="btn btn-outline-danger" aria-label={`Remover treinamento ${index + 1}`} disabled={treinamentos.length === 1} onClick={() => setTreinamentos(atual => atual.filter((_, i) => i !== index))}>×</button></div>
        </div></div>)}</div>
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-4"><button type="submit" className="btn btn-success px-4">Cadastrar funcionário</button><Link href="/treinamentos/dash" className="btn btn-outline-secondary">Voltar ao dashboard</Link></div>
      </form>
    </div></section>
  </main></Header>;
}
