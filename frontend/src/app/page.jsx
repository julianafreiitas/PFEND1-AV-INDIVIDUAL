

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Login() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);

  function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !senha) {
      alert("Preencha o e-mail e a senha.");
      return;
    }

    router.push("/treinamentos/dash");
  }

  return (
    <main className={styles.login}>
      <section className={styles.loginApresentacao}>
        <div className={styles.marca}>
        </div>

        <div className={styles.apresentacaoTexto}>
        <h1 className={styles.tituloVw}>
          Treinamento de <span className={styles.cor}>Reciclagem.</span>
          </h1>
          <div className={styles.linha}></div>


          <div className={styles.linhaVerde} />

          <p className={styles.subTitulo}>
            Gestão de treinamentos e controle
            dos prazos de reciclagem em um só lugar.
          </p>
        </div>

        <div className={styles.subTitulo}>
          Organização, segurança e acompanhamento.
        </div>
      </section>

      <section className={styles.loginConteudo}>
        <div className={styles.loginCartao}>
          <div className={styles.cartaoCabecalho}>
            <h2>Bem-vinda de volta!</h2>
            <p>Acesse sua conta para continuar.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className={styles.campo}>
              <label htmlFor="email">E-mail corporativo</label>
              <input className={styles.input}
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className={styles.campo2}>
              <label htmlFor="senha">Senha</label>

              <div className={styles.senhaContainer}>
                <input className={styles.input}
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete="current-password"
                  required
                />

                {/* <div 
                  className={styles.mostrarSenha}
                  type="button"
                  
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={
                    mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </div> */}
              </div>
            </div>

            {/* <div className={styles.opcoesLogin}>
              <label className={styles.lembrar}>
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(event) => setLembrar(event.target.checked)}
                />
                Lembrar de mim
              </label> */}
            {/* 
              <button
                type="button"
                className={styles.linkSenha}
                onClick={() =>
                  alert("A recuperação de senha será implementada depois.")
                }
              >
                Esqueceu a senha?
              </button> */}
            {/* </div> */}

    <div className={styles.btn}>
              <button className={styles.botaoEntrar} type="submit">
                Entrar
              </button>
            </div>


          </form>

          <div className={styles.cartaoRodape}>

            Acesso restrito a usuários autorizados.
          </div>
        </div>

      </section>
    </main>
  );
}
