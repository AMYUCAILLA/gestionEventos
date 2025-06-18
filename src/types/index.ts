// src/types/index.ts

export type RecurrenceOption = 'none' | 'daily' | 'weekly' | 'monthly';

export interface EventItem {
  id: string;
  title: string;
  invited: string[];            // lista de invitados (emails o nombres)
  date: string;                 // 'YYYY-MM-DD'
  time: string;                 // 'HH:mm'
  timezone: string;             // e.g., 'America/Denver'
  description: string;
  recurrence: RecurrenceOption; // 'none'|'daily'|'weekly'|'monthly'
  reminderMinutesBefore: number | null;
  category: string;             // clasificación
  locationId: string | null;    // id de la ubicación seleccionada
}



// src/types/index.ts
export interface LocationItem {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}



export interface ContactItem {
  id: string;
  salutation: string;    // saludo, e.g. 'Dr.', 'Sra.', etc.
  fullName: string;
  idNumber: string;
  email: string;
  phone: string;
  photoUrl: string | null; // URL de preview en base64 o ruta local
}
