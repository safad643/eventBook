import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import App from '@/App';
import '@/index.css';
import Spinner from '@/components/common/Spinner';
import { useAuth } from '@/hooks';

/**
 * Wrapper that shows a full-screen spinner while auth status is loading.
 * This prevents the route tree from rendering before we know if the user is logged in.
 */
function AuthGate({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthGate>
          <App />
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
