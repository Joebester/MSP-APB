import { BrowserRouter } from 'react-router-dom';
import { RegistrationProvider } from './context/RegistrationContext';
import { AppRoutes } from './routes/AppRoutes';
import toast, { Toaster } from 'react-hot-toast';
import './utils/i18n'
import '../src/css/index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-center' reverseOrder={false} />
      <RegistrationProvider>
        <AppRoutes />
      </RegistrationProvider>
    </BrowserRouter>
  );
}
