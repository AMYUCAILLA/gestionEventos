// src/context/dataContext.tsx
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EventItem, LocationItem, ContactItem } from '../types';

type Action =
  | { type: 'load'; payload: { events: EventItem[]; locations: LocationItem[]; contacts: ContactItem[] } }
  | { type: 'addEvent'; payload: EventItem }
  | { type: 'updateEvent'; payload: EventItem }
  | { type: 'deleteEvent'; payload: string }
  | { type: 'addLocation'; payload: LocationItem }
  | { type: 'updateLocation'; payload: LocationItem }
  | { type: 'deleteLocation'; payload: string }
  | { type: 'addContact'; payload: ContactItem }
  | { type: 'updateContact'; payload: ContactItem }
  | { type: 'deleteContact'; payload: string };

interface State {
  events: EventItem[];
  locations: LocationItem[];
  contacts: ContactItem[];
}


// 10 ubicaciones de ejemplo
const sampleLocations: LocationItem[] = [
  {
    id: uuidv4(),
    title: 'Auditorio Principal',
    address: 'Av. Siempre Viva 123, Ciudad',
    latitude: -33.4489,
    longitude: -70.6693,
  },
  {
    id: uuidv4(),
    title: 'Sala de Conferencias A',
    address: 'Calle Falsa 456, Ciudad',
    latitude: -33.4500,
    longitude: -70.6700,
  },
  {
    id: uuidv4(),
    title: 'Laboratorio de Cómputo',
    address: 'Av. Tecnológica 789, Ciudad',
    latitude: -33.4510,
    longitude: -70.6710,
  },
  {
    id: uuidv4(),
    title: 'Biblioteca Central',
    address: 'Calle Lectura 101, Ciudad',
    latitude: -33.4520,
    longitude: -70.6720,
  },
  {
    id: uuidv4(),
    title: 'Gimnasio',
    address: 'Av. Salud 202, Ciudad',
    latitude: -33.4530,
    longitude: -70.6730,
  },
  {
    id: uuidv4(),
    title: 'Sala de Talleres',
    address: 'Calle Creativa 303, Ciudad',
    latitude: -33.4540,
    longitude: -70.6740,
  },
  
];


// Muestra 10 contactos de ejemplo al iniciar si no hay datos en localStorage
const sampleContacts: ContactItem[] = [
  {
    id: uuidv4(),
    salutation: 'Sr.',
    fullName: 'Juan Pérez',
    idNumber: '10000001',
    email: 'juan.perez@example.com',
    phone: '+56910000001',
    photoUrl: null,
  },
  {
    id: uuidv4(),
    salutation: 'Sra.',
    fullName: 'María González',
idNumber: '10000002',
    email: 'maria.gonzalez@example.com',
    phone: '+56910000002',
    photoUrl: null,
  },
  {
    id: uuidv4(),
    salutation: 'Srta.',
    fullName: 'Ana Fernández',
    idNumber: '10000003',
    email: 'ana.fernandez@example.com',
    phone: '+56910000003',
    photoUrl: null,
  },
  {
    id: uuidv4(),
    salutation: 'Dr.',
    fullName: 'Roberto Martínez',
    idNumber: '10000004',
    email: 'roberto.martinez@example.com',
    phone: '+56910000004',
    photoUrl: null,
  },
  {
    id: uuidv4(),
    salutation: 'Dra.',
    fullName: 'Laura Ramírez',
    idNumber: '10000005',
    email: 'laura.ramirez@example.com',
    phone: '+56910000005',
    photoUrl: null,
  },
  {
    id: uuidv4(),
    salutation: 'Ing.',
    fullName: 'Carlos Soto',
    idNumber: '10000006',
    email: 'carlos.soto@example.com',
    phone: '+56910000006',
    photoUrl: null,
  },
  {
    id: uuidv4(),
    salutation: 'Prof.',
    fullName: 'Elena Torres',
    idNumber: '10000007',
    email: 'elena.torres@example.com',
    phone: '+56910000007',
    photoUrl: null,
  },

];



// 10 eventos de ejemplo, referenciando sampleLocations por índice
const sampleEvents: EventItem[] = [
  {
    id: uuidv4(),
    title: 'Conferencia de Tecnología',
    invited: ['juan.perez@example.com', 'maria.gonzalez@example.com'],
    date: '2025-07-01',
    time: '10:00',
    timezone: 'America/Denver',
    description: 'Charla sobre nuevas tendencias en tecnología.',
    recurrence: 'none',
    reminderMinutesBefore: 30,
    category: 'Conferencia',
    locationId: sampleLocations[0].id,
  },
  {
    id: uuidv4(),
    title: 'Taller de Programación',
    invited: ['ana.fernandez@example.com', 'carlos.soto@example.com'],
    date: '2025-07-05',
    time: '14:00',
    timezone: 'America/Denver',
    description: 'Taller práctico de JavaScript y React.',
    recurrence: 'none',
    reminderMinutesBefore: 60,
    category: 'Taller',
    locationId: sampleLocations[1].id,
  },
  {
    id: uuidv4(),
    title: 'Seminario de Matemáticas',
    invited: ['roberto.martinez@example.com'],
    date: '2025-07-10',
    time: '09:00',
    timezone: 'America/Denver',
    description: 'Seminario avanzado de álgebra.',
    recurrence: 'weekly',
    reminderMinutesBefore: 15,
    category: 'Seminario',
    locationId: sampleLocations[2].id,
  },
  {
    id: uuidv4(),
    title: 'Reunión del Proyecto X',
    invited: ['laura.ramirez@example.com', 'carlos.soto@example.com'],
    date: '2025-07-12',
    time: '11:00',
    timezone: 'America/Denver',
    description: 'Planificación del Proyecto X.',
    recurrence: 'none',
    reminderMinutesBefore: 10,
    category: 'Reunión',
    locationId: sampleLocations[3].id,
  },
  {
    id: uuidv4(),
    title: 'Clínica Deportiva',
    invited: ['miguel.silva@example.com', 'patricia.lopez@example.com'],
    date: '2025-07-15',
    time: '16:00',
    timezone: 'America/Denver',
    description: 'Sesión de actividades deportivas en el gimnasio.',
    recurrence: 'monthly',
    reminderMinutesBefore: 120,
    category: 'Clínica',
    locationId: sampleLocations[4].id,
  },
  
];

const initialState: State = {
  events: sampleEvents,
  locations: sampleLocations,
  contacts: sampleContacts,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'load':
      return {
        events: action.payload.events,
        locations: action.payload.locations,
        contacts: action.payload.contacts,
      };
    case 'addEvent':
      return { ...state, events: [...state.events, action.payload] };
    case 'updateEvent':
      return {
        ...state,
        events: state.events.map(e => e.id === action.payload.id ? action.payload : e),
      };
    case 'deleteEvent':
      return { ...state, events: state.events.filter(e => e.id !== action.payload) };
    case 'addLocation':
      return { ...state, locations: [...state.locations, action.payload] };
    case 'updateLocation':
      return {
        ...state,
        locations: state.locations.map(l => l.id === action.payload.id ? action.payload : l),
      };
    case 'deleteLocation':
      return { ...state, locations: state.locations.filter(l => l.id !== action.payload) };
    case 'addContact':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'updateContact':
      return {
        ...state,
        contacts: state.contacts.map(c => c.id === action.payload.id ? action.payload : c),
      };
    case 'deleteContact':
      return { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) };
    default:
      return state;
  }
}

interface DataContextProps extends State {
  addEvent: (item: EventItem) => void;
  updateEvent: (item: EventItem) => void;
  deleteEvent: (id: string) => void;
  addLocation: (item: LocationItem) => void;
  updateLocation: (item: LocationItem) => void;
  deleteLocation: (id: string) => void;
  addContact: (item: ContactItem) => void;
  updateContact: (item: ContactItem) => void;
  deleteContact: (id: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem('gestionEventosData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // si hay datos en storage, cargarlos: deben incluir arrays
        if (
          Array.isArray(parsed.events) &&
          Array.isArray(parsed.locations) &&
          Array.isArray(parsed.contacts)
        ) {
          dispatch({ type: 'load', payload: parsed });
        }
      } catch {}
    }
  }, []);

  // Persistir en localStorage al cambiar estado
  useEffect(() => {
    localStorage.setItem('gestionEventosData', JSON.stringify(state));
  }, [state]);

  const addEvent = (item: EventItem) => dispatch({ type: 'addEvent', payload: item });
  const updateEvent = (item: EventItem) => dispatch({ type: 'updateEvent', payload: item });
  const deleteEvent = (id: string) => dispatch({ type: 'deleteEvent', payload: id });
  const addLocation = (item: LocationItem) => dispatch({ type: 'addLocation', payload: item });
  const updateLocation = (item: LocationItem) => dispatch({ type: 'updateLocation', payload: item });
  const deleteLocation = (id: string) => dispatch({ type: 'deleteLocation', payload: id });
  const addContact = (item: ContactItem) => dispatch({ type: 'addContact', payload: item });
  const updateContact = (item: ContactItem) => dispatch({ type: 'updateContact', payload: item });
  const deleteContact = (id: string) => dispatch({ type: 'deleteContact', payload: id });

  return (
    <DataContext.Provider value={{
      events: state.events,
      locations: state.locations,
      contacts: state.contacts,
      addEvent, updateEvent, deleteEvent,
      addLocation, updateLocation, deleteLocation,
      addContact, updateContact, deleteContact,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextProps => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};