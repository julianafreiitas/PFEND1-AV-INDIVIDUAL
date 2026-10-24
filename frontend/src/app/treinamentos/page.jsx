"use client";

import { useState, useEffect } from "react";

const API = "http://localhost:3001/treinamentos";

const formularioInicial = {
  titulo: "",
  carga_horaria: "",
  data_realizacao: "",
  descricao: "",
};

export default function Treinamentos() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(formularioInicial);
  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

async function carregar() {
try {
setErro("");
const resposta = await fetch(API);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os treinamentos.");
  }

  const dados = await resposta.json();
  setLista(dados);
} catch {
  setErro("Não foi possível conectar à API. Confira se o backend está rodando.");
} finally {
  setCarregando(false);
}

}

useEffect(() => {
carregar();
}, []);

function alterar(event) {
const { name, value } = event.target;
setForm((atual) => ({ ...atual, [name]: value }));
}

async function salvar(event) {
event.preventDefault();
setMensagem("");
setErro("");

if (!form.titulo.trim() || !form.carga_horaria || !form.data_realizacao || !form.descricao.trim()) {
  setErro("Preencha todos os campos.");
  return;
}

if (Number(form.carga_horaria) <= 0) {
  setErro("A carga horária deve ser maior que zero.");
  return;
}

const dados = {
  ...form,
  titulo: form.titulo.trim(),
  carga_horaria: Number(form.carga_horaria),
  descricao: form.descricao.trim(),
};

try {
  const resposta = await fetch(
    editando ? `${API}/${editando}` : API,
    {
      method: editando ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }
  );

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || resultado.mensagem || "Não foi possível salvar.");
  }

  setMensagem(editando ? "Treinamento atualizado com sucesso!" : "Treinamento cadastrado com sucesso!");
  setForm(formularioInicial);
  setEditando(null);
  await carregar();
} catch (error) {
  setErro(error.message || "Erro ao salvar o treinamento.");
}

}

function editar(item) {
setForm({
titulo: item.titulo ?? "",
carga_horaria: String(item.carga_horaria ?? ""),
data_realizacao: item.data_realizacao ?? "",
descricao: item.descricao ?? "",
});
setEditando(item.id);
setMensagem("");
setErro("");
window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluir(id) {
if (!window.confirm("Deseja realmente excluir este treinamento?")) return;

setMensagem("");
setErro("");

try {
  const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });

  if (!resposta.ok) {
    throw new Error("Não foi possível excluir o treinamento.");
  }

  setMensagem("Treinamento excluído com sucesso!");
  await carregar();
} catch (error) {
  setErro(error.message || "Erro ao excluir o treinamento.");
}

}

function cancelar() {
setForm(formularioInicial);
setEditando(null);
setMensagem("");
setErro("");
}

return (

  

  
  
<main className="container py-4 py-md-5">
<div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

  <aside>

    <div
  className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
  style={{ width: 280 }}
>
  {" "}
  <a
    href="/"
    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
  >
    {" "}
    <svg className="bi pe-none me-2" width={40} height={32} aria-hidden="true">
      <use xlinkHref="#bootstrap" />
    </svg>{" "}
    <span className="fs-4">Sidebar</span>{" "}
  </a>{" "}
  <hr />{" "}
  <ul className="nav nav-pills flex-column mb-auto">
    {" "}
    <li className="nav-item">
      {" "}
      <a href="#" className="nav-link active" aria-current="page">
        {" "}
        <svg
          className="bi pe-none me-2"
          width={16}
          height={16}
          aria-hidden="true"
        >
          <use xlinkHref="#home" />
        </svg>
        Home
      </a>{" "}
    </li>{" "}
    <li>
      {" "}
      <a href="#" className="nav-link link-body-emphasis">
        {" "}
        <svg
          className="bi pe-none me-2"
          width={16}
          height={16}
          aria-hidden="true"
        >
          <use xlinkHref="#speedometer2" />
        </svg>
        Dashboard
      </a>{" "}
    </li>{" "}
    <li>
      {" "}
      <a href="#" className="nav-link link-body-emphasis">
        {" "}
        <svg
          className="bi pe-none me-2"
          width={16}
          height={16}
          aria-hidden="true"
        >
          <use xlinkHref="#table" />
        </svg>
        Orders
      </a>{" "}
    </li>{" "}
    <li>
      {" "}
      <a href="#" className="nav-link link-body-emphasis">
        {" "}
        <svg
          className="bi pe-none me-2"
          width={16}
          height={16}
          aria-hidden="true"
        >
          <use xlinkHref="#grid" />
        </svg>
        Products
      </a>{" "}
    </li>{" "}
    <li>
      {" "}
      <a href="#" className="nav-link link-body-emphasis">
        {" "}
        <svg
          className="bi pe-none me-2"
          width={16}
          height={16}
          aria-hidden="true"
        >
          <use xlinkHref="#people-circle" />
        </svg>
        Customers
      </a>{" "}
    </li>{" "}
  </ul>{" "}
  <hr />{" "}
  <div className="dropdown">
    {" "}
    <a
      href="#"
      className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {" "}
      <img
        src="https://github.com/mdo.png"
        alt=""
        width={32}
        height={32}
        className="rounded-circle me-2"
      />{" "}
      <strong>mdo</strong>{" "}
    </a>{" "}
    <ul className="dropdown-menu text-small shadow">
      {" "}
      <li>
        <a className="dropdown-item" href="#">
          New project...
        </a>
      </li>{" "}
      <li>
        <a className="dropdown-item" href="#">
          Settings
        </a>
      </li>{" "}
      <li>
        <a className="dropdown-item" href="#">
          Profile
        </a>
      </li>{" "}
      <li>
        <hr className="dropdown-divider" />
      </li>{" "}
      <li>
        <a className="dropdown-item" href="#">
          Sign out
        </a>
      </li>{" "}
    </ul>{" "}
  </div>{" "}
</div>

  </aside>

<div>
<h1 className="fw-bold mb-1">Treinamentos de Reciclagem</h1>
<p className="text-secondary mb-0">
Cadastre e acompanhe os treinamentos realizados.
</p>
</div>

    <span className="badge text-bg-success fs-6">
      {lista.length} registro(s)
    </span>
  </div>

  {mensagem && (
    <div className="alert alert-success" role="alert">
      {mensagem}
    </div>
  )}

  {erro && (
    <div className="alert alert-danger" role="alert">
      {erro}
    </div>
  )}

  <section className="card shadow-sm border-0 mb-4">
    <div className="card-body p-3 p-md-4">
      <h2 className="h4 fw-bold mb-3">
        {editando ? "Editar treinamento" : "Cadastrar treinamento"}
      </h2>

      <form onSubmit={salvar}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="titulo" className="form-label">
              Nome do treinamento
            </label>
            <input
              id="titulo"
              name="titulo"
              className="form-control"
              value={form.titulo}
              onChange={alterar}
              maxLength={100}
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="carga_horaria" className="form-label">
              Carga horária (horas)
            </label>
            <input
              id="carga_horaria"
              name="carga_horaria"
              type="number"
              min="1"
              className="form-control"
              value={form.carga_horaria}
              onChange={alterar}
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="data_realizacao" className="form-label">
              Data de realização
            </label>
            <input
              id="data_realizacao"
              name="data_realizacao"
              type="date"
              className="form-control"
              value={form.data_realizacao}
              onChange={alterar}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="descricao" className="form-label">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              className="form-control"
              rows="3"
              minLength={15}
              maxLength={100}
              value={form.descricao}
              onChange={alterar}
              placeholder="Descreva o treinamento (15 a 100 caracteres)."
              required
            />
            <div className="form-text">
              {form.descricao.length}/100 caracteres
            </div>
          </div>

          <div className="col-12 d-flex flex-wrap gap-2">
            <button type="submit" className="btn btn-success">
              {editando ? "Salvar alterações" : "Cadastrar treinamento"}
            </button>

            {editando && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={cancelar}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  </section>

  <section className="card shadow-sm border-0">
    <div className="card-body p-3 p-md-4">
      <h2 className="h4 fw-bold mb-3">Treinamentos cadastrados</h2>

      {carregando ? (
        <p className="text-secondary mb-0">Carregando treinamentos...</p>
      ) : lista.length === 0 ? (
        <p className="text-secondary mb-0">
          Nenhum treinamento cadastrado ainda.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Treinamento</th>
                <th>Carga horária</th>
                <th>Data</th>
                <th>Descrição</th>
                <th className="text-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr key={item.id}>
                  <td className="fw-semibold">{item.titulo}</td>
                  <td>{item.carga_horaria} h</td>
                  <td>{item.data_realizacao}</td>
                  <td>{item.descricao}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => editar(item)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => excluir(item.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>

  <div className="mt-4">
    <a href="/dashboard" className="btn btn-outline-secondary">
      Voltar ao painel
    </a>
  </div>
</main>

);
}