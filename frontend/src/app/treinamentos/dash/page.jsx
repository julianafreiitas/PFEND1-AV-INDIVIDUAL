"use client";

import { useEffect, useState } from "react";
import Header from "../../components/header";

const STORAGE_KEY = "funcionarios";

export default function Dashboard() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [modal, setModal] = useState(null);
  const [nome, setNome] = useState("");

  useEffect(() => {
    try {
      setFuncionarios(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      setFuncionarios([]);
    }
  }, []);

  function persistir(novos) {
    setFuncionarios(novos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
  }

  function confirmar() {
    if (!modal) return;
    if (modal.tipo === "excluir") {
      persistir(funcionarios.filter((item) => item.id !== modal.funcionario.id));
    } else {
      const atualizado = { ...modal.funcionario, nome: nome.trim() };
      persistir(funcionarios.map((item) => item.id === atualizado.id ? atualizado : item));
    }
    setModal(null);
  }

  return (
    <Header>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div><h1 className="h2 fw-bold mb-1">Dashboard</h1><p className="text-secondary mb-0">Visão geral dos funcionários cadastrados.</p></div>
      </div>
      <div className="card border-0 shadow-sm mb-4" style={{ maxWidth: 320 }}>
        <div className="card-body"><div className="text-secondary">Total de funcionários</div><div className="display-5 fw-bold">{funcionarios.length}</div></div>
      </div>
      <section className="card border-0 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 fw-bold mb-3">Funcionários</h2>
          {funcionarios.length === 0 ? <p className="text-secondary mb-0">Nenhum funcionário cadastrado.</p> : (
            <div className="table-responsive"><table className="table table-hover align-middle mb-0">
              <thead className="table-light"><tr><th>Nome do funcionário</th><th className="text-end">Ações</th></tr></thead>
              <tbody>{funcionarios.map((funcionario) => <tr key={funcionario.id}>
                <td className="fw-semibold">{funcionario.nome}</td>
                <td><div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => { setNome(funcionario.nome); setModal({ tipo: "editar", funcionario }); }}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setModal({ tipo: "excluir", funcionario })}>Excluir</button>
                </div></td>
              </tr>)}</tbody>
            </table></div>
          )}
        </div>
      </section>
      {modal && <div className="modal-backdrop-custom" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
        <div className="modal-dialog modal-dialog-centered" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
          <div className="modal-content">
            <div className="modal-header"><h2 className="modal-title fs-5" id="modal-titulo">{modal.tipo === "editar" ? "Editar funcionário" : "Excluir funcionário"}</h2><button className="btn-close" aria-label="Fechar" onClick={() => setModal(null)} /></div>
            <div className="modal-body">{modal.tipo === "editar" ? <><label className="form-label" htmlFor="editar-nome">Nome do funcionário</label><input id="editar-nome" className="form-control" value={nome} onChange={(event) => setNome(event.target.value)} /></> : <p className="mb-0">Deseja excluir <strong>{modal.funcionario.nome}</strong>? Esta ação não pode ser desfeita.</p>}</div>
            <div className="modal-footer"><button className="btn btn-outline-secondary" onClick={() => setModal(null)}>Cancelar</button><button className={`btn ${modal.tipo === "editar" ? "btn-primary" : "btn-danger"}`} disabled={modal.tipo === "editar" && !nome.trim()} onClick={confirmar}>{modal.tipo === "editar" ? "Salvar alterações" : "Excluir funcionário"}</button></div>
          </div>
        </div>
      </div>}
    </Header>
  );
}
