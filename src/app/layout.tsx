import React from 'react';
import './globals.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Catálogo de Produções</title>
      </head>
      <body>
        <div>
          <header className="header">
            <h1>Catálogo de Produções</h1>
          </header>
          <main className="container">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default Layout;