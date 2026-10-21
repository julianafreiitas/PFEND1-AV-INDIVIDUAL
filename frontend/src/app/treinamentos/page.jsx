
<main className="container py-4 py-md-5">
  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
    <div>
      <a href="/dashboard" className="text-success text-decoration-none">
        ← Voltar ao painel
      </a>

      <h1 className="fw-bold mt-3">Treinamentos</h1>

      <p className="text-secondary">
        Gerencie os treinamentos de reciclagem.
      </p>
    </div>

    <span className="badge text-bg-success fs-6">
      {lista.length} registro(s)
    </span>
  </div>

  <section className="card border-0 shadow-sm mb-4">
    <div className="card-body p-3 p-md-4">
      <h2 className="h5 fw-bold mb-4">
        {editando ? "Editar treinamento" : "Novo treinamento"}
      </h2>

      <form onSubmit={salvar}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="titulo" className="form-label">
              Título
            </label>

            <input
              id="titulo"
              name="titulo"
              className="form-control"
              value={form.titulo}
              onChange={alterar}
              required
              maxLength={120}
            />
          </div>

          <div className="col-12 col-md-6">
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

          <div className="col-12 col-md-6">
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
              value={form.descricao}
              onChange={alterar}
              required
              minLength={5}
              maxLength={500}
            />
          </div>

          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-success">
              {editando ? "Salvar alterações" : "Cadastrar"}
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

      {mensagem && (
        <div
          className={`alert ${erro ? "alert-danger" : "alert-success"} mt-3 mb-0`}
          role="status"
        >
          {mensagem}
        </div>
      )}
    </div>
  </section>

  <section className="card border-0 shadow-sm">
    <div className="card-body p-3 p-md-4">
      <h2 className="h5 fw-bold mb-3">Registros cadastrados</h2>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Título</th>
              <th>Carga horária</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {lista.map((item) => (
              <tr key={item.id}>
                <td>{item.titulo}</td>
                <td>{item.carga_horaria} h</td>
                <td>
                  {String(item.data_realizacao)
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </td>
                <td>{item.descricao}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
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

            {lista.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-secondary py-4">
                  Nenhum treinamento cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
</main>
