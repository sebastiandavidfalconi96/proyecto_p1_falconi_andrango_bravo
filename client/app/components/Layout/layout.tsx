import React from 'react';
import './layout.css'; // Asegúrate de tener un archivo CSS para estilos básicos.

const Layout: React.FC = ({ children }) => {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">📚 BookLoans</div>
        <nav className="nav">
          <ul>
            <li><a href="#dashboard">🏠 Home</a></li>
            <li><a href="#books">📘 Books</a></li>
            <li><a href="#users">👥 Users</a></li>
            <li><a href="#loans">📄 Loans</a></li>
            <li><a href="#settings">⚙️ Settings</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="main">
        <header className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search books, users, or loans..." />
          </div>
          <div className="user-menu">
            <span>Admin</span>
            <img src="https://via.placeholder.com/40" alt="User Avatar" />
          </div>
        </header>

        <main className="content">
          {children}
        </main>

        <footer className="footer">
          <p>© 2024 BookLoans. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
