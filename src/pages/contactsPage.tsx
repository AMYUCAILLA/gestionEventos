// src/pages/ContactsPage.tsx
import React, { useState, useMemo } from 'react';
import { useData } from '../context/dataContext';
import { ContactItem } from '../types';
import ContactForm from '../pages/contactForm'; 
import './ContactsPage.css';

const ContactsPage: React.FC = () => {
  const { contacts, deleteContact } = useData();
  const [editing, setEditing] = useState<ContactItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (c: ContactItem) => {
    setEditing(c);
    setShowForm(true);
  };
  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  // Filtrar contactos según searchTerm en fullName, idNumber, email o phone
  const filteredContacts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter(c => {
      if (c.fullName.toLowerCase().includes(term)) return true;
      if (c.idNumber.toLowerCase().includes(term)) return true;
      if (c.email.toLowerCase().includes(term)) return true;
      if (c.phone.toLowerCase().includes(term)) return true;
      // opcional: buscar en salutation
      if (c.salutation.toLowerCase().includes(term)) return true;
      return false;
    });
  }, [contacts, searchTerm]);

  return (
    <div className="contacts-page">
      <header className="contacts-header">
        <h2>Contactos</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, ID, email o teléfono..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="search-icon" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          <button onClick={handleAdd}>+ Nuevo Contacto</button>
        </div>
      </header>

      {showForm && (
        <ContactForm existing={editing || undefined} onClose={handleCloseForm} />
      )}

      <table className="contacts-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Saludo</th>
            <th>Nombre Completo</th>
            <th>ID</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map(c => (
            <tr key={c.id}>
              <td>
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt={`Foto de ${c.fullName}`} className="contact-photo" />
                ) : '-'}
              </td>
              <td>{c.salutation}</td>
              <td>{c.fullName}</td>
              <td>{c.idNumber}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Editar</button>
                <button onClick={() => {
                  if (confirm('¿Eliminar contacto?')) deleteContact(c.id);
                }}>Eliminar</button>
              </td>
            </tr>
          ))}
          {filteredContacts.length === 0 && (
            <tr>
              <td colSpan={7}>
                {searchTerm
                  ? 'No hay contactos que coincidan con la búsqueda.'
                  : 'No hay contactos.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsPage;
