"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../components/header";

const STORAGE_KEY = "funcionarios";
const treinamentoVazio = { nome: "", data: "" };

export default function CadastroFuncionario() {
  const [nome, setNome] = useState("");
  const [treinamentos, setTreinamentos] = useState([{ ...treinamentoVazio }]);
  const [mensagem, setMensagem] = useState("");

  function atualizarTreinamento(index, campo, valor) {
    setTreinamentos((atuais) => atuais.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  }

  function salvar(event) {
    event.preventDefault();
    const dadosTreinamentos = treinamentos.map((item) => ({ nome: item.nome.trim(), data: item.data }));
    if (!nome.trim() || dadosTreinamentos.some((item) => !item.nome || !item.data)) {
      setMensagem("Preencha o nome do funcionário e todos os treinamentos e datas.");
      return;
    }
    let atuais = [];
    try { atuais = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { atuais = []; }
    atuais.push({ id: globalThis.crypto?.randomUUID?.() || String(Date.now()), nome: nome.trim(), treinamentos: dadosTreinamentos });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atuais));
    setNome("");
    setTreinamentos([{ ...treinamentoVazio }]);
    setMensagem("Funcionário cadastrado com sucesso.");
  }

  return <Header>
    <div className="mb-4"><h1 className="h2 fw-bold mb-1">Cadastrar funcionário</h1><p className="text-secondary mb-0">Informe o funcionário e todos os treinamentos realizados.</p></div>
    <section className="card border-0 shadow-sm" style={{ maxWidth: 900 }}><div className="card-body p-3 p-md-4">
      {mensagem && <div className={`alert ${mensagem.startsWith("Funcionário") ? "alert-success" : "alert-danger"}`} role="status">{mensagem}</div>}
      <form onSubmit={salvar}>
        <div className="mb-4"><label htmlFor="nome-funcionario" className="form-label fw-semibold">Nome do funcionário</label><input id="nome-funcionario" className="form-control" value={nome} onChange={(event) => setNome(event.target.value)} required maxLength={120} /></div>
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3"><h2 className="h5 fw-bold mb-0">Treinamentos</h2><button type="button" className="btn btn-outline-success btn-sm" onClick={() => setTreinamentos((atuais) => [...atuais, { ...treinamentoVazio }])}>+ Adicionar treinamento</button></div>
        <div className="d-flex flex-column gap-3">{treinamentos.map((item, index) => <div className="row g-3 align-items-end border rounded p-2 mx-0" key={index}>
          <div className="col-12 col-md-7"><label htmlFor={`treinamento-${index}`} className="form-label">Nome do treinamento</label><input id={`treinamento-${index}`} className="form-control" value={item.nome} onChange={(event) => atualizarTreinamento(index, "nome", event.target.value)} required /></div>
          <div className="col-9 col-md-3"><label htmlFor={`data-${index}`} className="form-label">Data do treinamento</label><input id={`data-${index}`} type="date" className="form-control" value={item.data} onChange={(event) => atualizarTreinamento(index, "data", event.target.value)} required /></div>
          <div className="col-3 col-md-2 d-grid"><button type="button" className="btn btn-outline-danger" aria-label={`Remover treinamento ${index + 1}`} disabled={treinamentos.length === 1} onClick={() => setTreinamentos((atuais) => atuais.filter((_, i) => i !== index))}>Remover</button></div>
        </div>)}</div>
        <div className="d-flex flex-wrap gap-2 mt-4"><button type="submit" className="btn btn-success">Cadastrar funcionário</button><Link href="/treinamentos/dash" className="btn btn-outline-secondary">Voltar ao dashboard</Link></div>
      </form>
    </div></section>
  </Header>;
}
