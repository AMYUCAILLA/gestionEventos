
import  { useState, FormEvent, useEffect } from 'react';

import { ContactItem } from '../types';
import { useData } from '../context/dataContext';
import { v4 as uuidv4 } from 'uuid';
import './ContactForm.css';

interface Props {
  existing?: ContactItem;
  onClose: () => void;
}

const salutations = ['Sr.', 'Sra.', 'Srta.', 'Dr.', 'Dra.', 'Ing.', 'Prof.', 'Otros'];

const ContactForm: React.FC<Props> = ({ existing, onClose }) => {
  const { addContact, updateContact } = useData();
  const [salutation, setSalutation] = useState(existing?.salutation || salutations[0]);
  const [fullName, setFullName] = useState(existing?.fullName || '');
  const [idNumber, setIdNumber] = useState(existing?.idNumber || '');
  const [email, setEmail] = useState(existing?.email || '');
  const [phone, setPhone] = useState(existing?.phone || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(existing?.photoUrl || null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (photoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(photoFile);
    }
  }, [photoFile]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!fullName.trim()) errs.fullName = 'Nombre es requerido.';
    if (!idNumber.trim()) errs.idNumber = 'Número de identificación es requerido.';
    if (!email.trim()) errs.email = 'Correo es requerido.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Formato de email inválido.';
    if (!phone.trim()) errs.phone = 'Teléfono es requerido.';
    // opcional: validación más estricta de teléfono
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    const item: ContactItem = {
      id: existing?.id || uuidv4(),
      salutation,
      fullName: fullName.trim(),
      idNumber: idNumber.trim(),
      email: email.trim(),
      phone: phone.trim(),
      photoUrl,
    };
    if (existing) updateContact(item);
    else addContact(item);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
        <h3 id="contact-form-title">{existing ? 'Editar Contacto' : 'Nuevo Contacto'}</h3>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="salutation">Saludo</label>
            <select
              id="salutation"
              value={salutation}
              onChange={e => setSalutation(e.target.value)}
            >
              {salutations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Nombre Completo *</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              autoFocus
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="idNumber">Número de Identificación *</label>
            <input
              id="idNumber"
              type="text"
              value={idNumber}
              onChange={e => setIdNumber(e.target.value)}
              aria-invalid={!!errors.idNumber}
            />
            {errors.idNumber && <span className="error">{errors.idNumber}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono *</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="photo">Fotografía</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) setPhotoFile(e.target.files[0]);
              }}
            />
            {photoUrl && (
              <img src={photoUrl} alt="Preview" className="photo-preview" />
            )}
          </div>
          <div className="form-actions">
            <button type="submit">{existing ? 'Guardar' : 'Crear'}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;


