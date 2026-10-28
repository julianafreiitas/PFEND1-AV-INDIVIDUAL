"use client";
import "./cadastro.css";
import Header from "../components/header";
import "bootstrap/dist/css/bootstrap.min.css";

import { useState, useEffect } from "react";

const API = "/api/treinamentos";

const formularioInicial = {
  titulo: "",
  carga_horaria: "",
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
  setErro("Não foi possível carregar os dados. Atualize a página e tente novamente.");
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

if (!form.titulo.trim() || !form.carga_horaria || !form.descricao.trim()) {
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
<Header>
<main className="principal">


<div className="dash">
<div >
<h1 className="fw-bold mb-1">Treinamentos de Reciclagem</h1>
<p className="text-secondary mb-0">
Cadastre e acompanhe os treinamentos realizados.
</p>
</div>

    <span className="badge text-bg-success fs-6">
      {lista.length} registro(s)
    </span>
 

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
          </div><div className="col-12">
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
                <th>Descrição</th>
                <th className="text-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr key={item.id}>
                  <td className="fw-semibold">{item.titulo}</td>
                  <td>{item.carga_horaria} h</td>
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
    <a href="/treinamentos/dash" className="btn btn-outline-secondary">
      Voltar ao painel
    </a>
  </div>

  </div>
</main>
</Header>
);
}
