import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import siteConfig from "../../config/siteConfig";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const navigation = siteConfig.navigation;
  const tel = siteConfig.contact.phone.replace(/[^\d+]/g, "");

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu} aria-label="Vasavi Bhuvi home">
          <span className="navbar-brand-main">VASAVI</span><span className="navbar-brand-sub">BHUVI</span>
        </Link>
        <nav className="navbar-desktop-nav">
          {navigation.map((item) => <NavLink key={item.path} to={item.path} className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>{item.label}</NavLink>)}
        </nav>
        <div className="navbar-actions">
          <a href={`tel:${tel}`} className="navbar-phone"><Phone size={16} /><span>Call Us</span></a>
          <Link to="/contact" className="navbar-enquiry">Enquire Now<ArrowUpRight size={17} /></Link>
        </div>
        <button type="button" className="navbar-menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={26} /> : <Menu size={26} />}</button>
      </div>
      <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}>
        <nav>{navigation.map((item) => <NavLink key={item.path} to={item.path} onClick={closeMenu} className={({ isActive }) => `navbar-mobile-link ${isActive ? "active" : ""}`}><span>{item.label}</span><ArrowUpRight size={18} /></NavLink>)}</nav>
        <div className="navbar-mobile-footer">
          <a href={`tel:${tel}`}><Phone size={17} />{siteConfig.contact.phone}</a>
          <Link to="/contact" onClick={closeMenu}>Enquire Now</Link>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
