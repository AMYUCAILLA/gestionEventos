
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Gestión Eventos</div>
      <ul className="navbar-links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Inicio</NavLink></li>
        <li><NavLink to="/events" className={({ isActive }) => isActive ? 'active' : ''}>Eventos</NavLink></li>
        <li><NavLink to="/locations" className={({ isActive }) => isActive ? 'active' : ''}>Ubicaciones</NavLink></li>
        <li><NavLink to="/contacts" className={({ isActive }) => isActive ? 'active' : ''}>Contactos</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;


