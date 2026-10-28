"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/treinamentos/dash", label: "Dashboard" },
  { href: "/treinamentos/funcionarios", label: "Cadastrar funcionário" },
  { href: "/treinamentos", label: "Cadastro de treinamentos" },
];

export default function Header({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const paginaAtual = links.find(link => link.href === pathname)?.label || "Painel";

  return <div className="app-shell d-flex min-vh-100">
    <aside className="app-sidebar d-flex flex-column text-white">
      <Link href="/treinamentos/dash" className="brand-lockup" aria-label="Reciclagem, ir para o dashboard">
        <span className="brand-mark" aria-hidden="true">R</span>
        <span className="brand-copy"><strong>Reciclagem</strong><small>GESTÃO DE TREINAMENTOS</small></span>
      </Link>
      <div className="sidebar-section-label">MENU PRINCIPAL</div>
      <nav className="nav nav-pills flex-column sidebar-nav" aria-label="Navegação principal">
        {links.map(link => {
          const active = pathname === link.href;
          return <Link key={link.href} href={link.href} aria-label={link.label} aria-current={active ? "page" : undefined} className={`nav-link sidebar-link ${active ? "active" : ""}`}>
            <span className="sidebar-link-mark" aria-hidden="true" />
            <span className="nav-label">{link.label}</span>
          </Link>;
        })}
      </nav>
      <div className="sidebar-bottom"><span className="sidebar-bottom-caption">Sessão atual</span><button type="button" className="sidebar-logout" onClick={() => router.push("/")}><span className="logout-mark" aria-hidden="true">↗</span><span className="logout-label">Sair</span></button></div>
    </aside>
    <div className="app-content">
      <header className="app-topbar"><div><span className="topbar-caption">SISTEMA DE TREINAMENTOS</span><span className="topbar-page">{paginaAtual}</span></div><span className="topbar-status"><i aria-hidden="true" /> Painel de controle</span></header>
      <main className="container-fluid app-main">{children}</main>
    </div>
  </div>;
}
