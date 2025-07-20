import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { DataProvider } from './context/dataContext'
import { useSpeech }     from './context/speechContext'

import Navbar         from './componentes/navBar'
import HelpPage         from './pages/HelpPage'
import HomePage       from './pages/homePage'
import EventsPage     from './pages/eventsPage'
import LocationsPage  from './pages/locationsPage'
import ContactsPage   from './pages/contactsPage'

import './styles/global.css'
import './App.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation()
  const isHome       = pathname === '/'
  const { t }        = useTranslation()
  const { speak }    = useSpeech()

  useEffect(() => {
    const section =
      pathname === '/'               ? t('navbar.home')       :
      pathname.startsWith('/events') ? t('navbar.events')     :
      pathname.startsWith('/locations') ? t('navbar.locations') :
      pathname.startsWith('/contacts')  ? t('navbar.contacts')  :
      ''
    section && speak(section)
  }, [pathname, t, speak])

  return (
    <div className="app-container">
      <Navbar />
      <div className={`app-main${isHome ? ' centered' : ''}`}>{children}</div>
    </div>
  )
}

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/events"    element={<EventsPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/contacts"  element={<ContactsPage />} />
            <Route path="*" element={<HomePage />} />
            <Route path="/help" element={<HelpPage />} />

          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  )
}
export default App


