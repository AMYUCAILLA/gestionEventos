// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/dataContext';
import Navbar from './componentes/navBar';
import EventsPage from './pages/eventsPage';
import LocationsPage from './pages/locationsPage';
import ContactsPage from './pages/contactsPage';
import HomePage from './pages/homePage';
import './styles/global.css';
import './App.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <div className="app-container">
      <Navbar />
  
      <div className={`app-main${isHome ? ' centered' : ''}`}>
    
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
