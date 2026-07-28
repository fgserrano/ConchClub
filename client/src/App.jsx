import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SubmissionPoolPage from './pages/SubmissionPoolPage';
import OfficialSelectionPage from './pages/OfficialSelectionPage';
import SelectionPage from './pages/SelectionPage';
import AdminPanel from './pages/AdminPanel';
import ArchivePage from './pages/ArchivePage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<OfficialSelectionPage />} />
            <Route path="/pool" element={<SubmissionPoolPage />} />
            <Route path="/submit" element={<SelectionPage />} />
            <Route path="/archives" element={<ArchivePage />} />
          </Route>
          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
