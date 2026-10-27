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

  function sair() {
    router.push("/");
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <aside className="app-sidebar d-flex flex-column p-3 text-white">
        <Link href="/treinamentos/dash" className="fs-5 fw-bold text-white text-decoration-none mb-4">
          Reciclagem
        </Link>
        <nav className="nav nav-pills flex-column gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : "text-white"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="btn btn-outline-light mt-auto" onClick={sair}>
          Sair
        </button>
      </aside>
      <div className="flex-grow-1 min-vw-0">
        <header className="app-topbar bg-white border-bottom px-4 py-3">
          <span className="fw-semibold text-secondary">Sistema de gestão de treinamentos</span>
        </header>
        <main className="container-fluid p-3 p-lg-4">{children}</main>
      </div>
    </div>
  );
}
