// ============================================
// src/App.tsx
// ============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notificacoes from './pages/Notificacoes';
import NovoNotificacao from './pages/Notificacoes/Novo';
import EditarNotificacao from './pages/Notificacoes/Editar';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-500">Carregando...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notificacoes"
        element={
          <ProtectedRoute>
            <Notificacoes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notificacoes/novo"  // ← ADICIONAR
        element={
          <ProtectedRoute>
            <NovoNotificacao />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
      <Route
        path="/notificacoes/:id/editar"
        element={
          <ProtectedRoute>
            <EditarNotificacao />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;