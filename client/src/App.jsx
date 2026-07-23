import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubmissionPoolPage from './pages/SubmissionPoolPage';
import OfficialSelectionPage from './pages/OfficialSelectionPage';
import SelectionPage from './pages/SelectionPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<SubmissionPoolPage />} />
            <Route path="/selection" element={<OfficialSelectionPage />} />
            <Route path="/submit" element={<SelectionPage />} />
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
