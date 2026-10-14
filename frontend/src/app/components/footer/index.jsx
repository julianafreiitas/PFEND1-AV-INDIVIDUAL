import "./footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <span>{"\u00a9"} 2025 Company, Inc.</span>

      <nav aria-label="Redes sociais">
        <a href="https://www.instagram.com/" aria-label="Instagram">
          Instagram
        </a>
        <a href="https://www.facebook.com/" aria-label="Facebook">
          Facebook
        </a>
      </nav>
    </footer>
  );
}
