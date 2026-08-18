// ============================================
// src/App.tsx
// ============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks';
import { useToast } from './hooks/useToast';
import { Toast } from './components/Toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notificacoes from './pages/Notificacoes';
import NovoNotificacao from './pages/Notificacoes/Novo';
import EditarNotificacao from './pages/Notificacoes/Editar';
import Relatorios from './pages/Relatorios';
import Localidades from './pages/Localidades';
import Perfil from './pages/Perfil';  // ← ADICIONAR

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
  const { toast, showToast, hideToast } = useToast();

  return (
    <>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

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
          path="/notificacoes/novo"
          element={
            <ProtectedRoute>
              <NovoNotificacao showToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notificacoes/:id/editar"
          element={
            <ProtectedRoute>
              <EditarNotificacao showToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <ProtectedRoute>
              <Relatorios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/localidades"
          element={
            <ProtectedRoute>
              <Localidades showToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"  // ← ADICIONAR
          element={
            <ProtectedRoute>
              <Perfil showToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;