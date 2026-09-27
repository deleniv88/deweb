/* Хедер: лого, мова, меню. На головній посилання — якорі (#services),
   на інших сторінках — ведуть на головну (/#services). */
export default function Header({ home = true }: { home?: boolean }) {
  const p = home ? "" : "/";
  const links = [
    { href: `${p}#services`, label: "Services" },
    { href: `${p}#projects`, label: "Projects" },
    { href: `${p}#process`, label: "Process" },
    { href: `${p}#faq`, label: "FAQ" },
  ];
  return (
    <header className="site-header" data-site-header>
      <a href="/" className="logo" aria-label="Deweb studio — home">
        <span className="logo__main">D<span className="logo__e">e</span>web</span>
        <span className="logo__sub">studio</span>
      </a>
      <div className="header-right">
        <button className="glass lang" type="button" aria-label="Change language">
          <span className="pill">
            PL
            <svg viewBox="0 0 8 4" fill="none" aria-hidden="true"><path d="M.5.5 4 3.5 7.5.5" stroke="#242527" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </button>
        <button className="glass burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="main-nav">
          <span className="pill"><i></i><i></i></span>
        </button>
        <nav className="glass nav" id="main-nav" aria-label="Main">
          <ul className="nav__list">
            {links.map((l) => (
              <li key={l.label}><a className="nav__link" href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
