import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'; // Ajoute cette ligne
import Register from './components/Register.jsx';
import GestionComptes from './components/GestionComptes.jsx';
import PlanifierRendezVous from './components/PlanifierRendezVous.jsx';
import ListeRendezVous from './components/ListeRendezVous.jsx';
import Login from './components/Login.jsx';
import PatientDashboard from './components/PatientDashboard.jsx';
import DoctorDashboard from './components/DoctorDashboard.jsx';

function Navigation() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <nav>
            {!role ? (
                <>
                    <Link to="/login">Connexion</Link> |{' '}
                    <Link to="/register">Inscription</Link>
                </>
            ) : (
                <>
                    {role === 'ADMIN' && <Link to="/gestion-comptes">Gestion des comptes</Link>}
                    {role === 'SECRETAIRE' && <Link to="/planifier-rendezvous">Planifier un rendez-vous</Link>}
                    
                </>
            )}
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div>
                <Navigation />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/gestion-comptes" element={<GestionComptes />} />
                    <Route path="/planifier-rendezvous" element={<PlanifierRendezVous />} />
                    <Route path="/liste-rendezvous" element={<ListeRendezVous />} />
                    <Route path="/patient-dashboard" element={<PatientDashboard />} />
                    <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                    <Route path="/" element={<div><h2>Bienvenue</h2></div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;