import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Globe, Menu, X, User } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.warn("Failed to parse user from localStorage");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/explore" className="logo">
            Sideline
          </Link>
        </div>

        <nav className="nav-links">
          <NavLink to="/find-work" className="nav-link">
            Find Work
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </nav>
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>


        <div className="header-right">
          {user ? (
            <>
              <Link to="/profile" className="icon-btn">
                <User size={20} />
              </Link>
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary desktop-only">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary desktop-only">
                Sign up
              </Link>
            </>
          )}


          <button className="icon-btn menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav-links">
            <NavLink
              to="/find-work"
              onClick={toggleMenu}
              className="mobile-link"
            >
              Find Work
            </NavLink>
            <NavLink to="/about" onClick={toggleMenu} className="mobile-link">
              About
            </NavLink>
          </nav>

          {user ? (
            <>
              <button className="mobile-btn logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-btn" onClick={toggleMenu}>
                Log in
              </Link>
              <Link
                to="/signup"
                className="mobile-btn primary"
                onClick={toggleMenu}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
