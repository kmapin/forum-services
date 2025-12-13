import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { ServicesListPage } from './pages/ServicesListPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ConciergerieAdminWrapper } from './pages/ConciergerieAdminWrapper';
import './index.css';

// Importer les devTools et exemples en développement
if (process.env.NODE_ENV === 'development') {
  import('./utils/devTools');
  import('./examples/testServiceRequest');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/services" element={<ServicesListPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/admin/conciergerie" element={<ConciergerieAdminWrapper />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
