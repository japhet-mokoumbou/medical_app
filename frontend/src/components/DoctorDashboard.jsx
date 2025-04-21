import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

// Données mockées pour les notifications
const mockNotifications = [
  { id: 1, message: 'Rendez-vous confirmé par le patient Dupont le 15/04/2025', date: '01/04/2025' },
];

// Données mockées pour les rendez-vous (à remplacer par l'API)
const mockAppointments = [
  {
    id: 1,
    patient: { nom: 'Dupont', prenom: 'Jean' },
    date: '2025-04-15',
    heure: '14:30',
    statut: 'en_attente',
  },
  {
    id: 2,
    patient: { nom: 'Martin', prenom: 'Sophie' },
    date: '2025-04-16',
    heure: '10:00',
    statut: 'confirme',
  },
];

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAppointments, setShowAppointments] = useState(false); // État pour afficher/masquer la liste des rendez-vous
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Utiliser des données mockées pour les rendez-vous au lieu de l'API
                setAppointments(mockAppointments);

                // Utiliser des données mockées pour les notifications
                setNotifications(mockNotifications);
            } catch (err) {
                console.error('Erreur lors de la récupération des données:', err);
                if (err.response && err.response.status === 403) {
                    setError('Accès refusé (403). Vérifie ton token ou l\'endpoint /rendezvous/medecin.');
                } else {
                    setError('Erreur lors du chargement des données. Veuillez réessayer.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleConfirm = async (id) => {
        try {
            await axios.put(
                `http://localhost:8080/api/rendezvous/${id}/confirmer`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppointments(appointments.map(appt =>
                appt.id === id ? { ...appt, statut: 'confirme' } : appt
            ));
        } catch (error) {
            console.error('Erreur lors de la confirmation:', error);
            setError('Erreur lors de la confirmation du rendez-vous.');
        }
    };

    const handleCancel = async (id) => {
        try {
            await axios.put(
                `http://localhost:8080/api/rendezvous/${id}/annuler`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppointments(appointments.map(appt =>
                appt.id === id ? { ...appt, statut: 'annule' } : appt
            ));
        } catch (error) {
            console.error('Erreur lors de l\'annulation:', error);
            setError('Erreur lors de l\'annulation du rendez-vous.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const handleShowAppointments = () => {
        setShowAppointments(!showAppointments); // Basculer l'affichage de la liste des rendez-vous
    };

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5', width: '100vw', m: 0, p: 0 }}>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2', width: '100%' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Bienvenu dans votre tableau de bord
                    </Typography>
                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    width: '100vw',
                    m: 0,
                    p: 0,
                    mt: 4,
                    pb: 4,
                }}
            >
                {/* Section avec des cartes "raccourcis" */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', px: { xs: 1, sm: 2 }, mb: 3 }}>
                    {/* Carte Rendez-vous */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ flex: 1, minWidth: '200px', maxWidth: '300px' }}
                    >
                        <Card
                            sx={{
                                boxShadow: 3,
                                width: '100%',
                                p: 2,
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: '#f0f0f0' },
                            }}
                            onClick={handleShowAppointments}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                <Box>
                                    <Typography variant="h6">Rendez-vous</Typography>
                                    <Typography color="textSecondary">
                                        {appointments.length} rendez-vous à venir
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                    {/* Placeholder pour les cartes Patients et Dossiers médicaux */}
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
                        {error}
                    </Typography>
                ) : (
                    <>
                        {/* Afficher la liste des rendez-vous uniquement si showAppointments est vrai */}
                        {showAppointments && (
                            <Box sx={{ px: { xs: 1, sm: 2 }, mb: 3 }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card sx={{ boxShadow: 3, width: '100%', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                <EventIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                                                Mes rendez-vous
                                            </Typography>
                                            {appointments.length === 0 ? (
                                                <Typography color="textSecondary">Aucun rendez-vous à venir.</Typography>
                                            ) : (
                                                <List>
                                                    {appointments.map((appt) => (
                                                        <ListItem key={appt.id}>
                                                            <Card sx={{ width: '100%', p: 2, boxShadow: 1 }}>
                                                                <CardContent>
                                                                    <Typography variant="h6">
                                                                        Rendez-vous avec {appt.patient?.nom || 'Inconnu'} {appt.patient?.prenom || ''}
                                                                    </Typography>
                                                                    <Typography color="textSecondary">
                                                                        Date: {appt.date} à {appt.heure}
                                                                    </Typography>
                                                                    <Typography color="textSecondary">
                                                                        Statut: {appt.statut || 'Inconnu'}
                                                                    </Typography>
                                                                    {appt.statut === 'en_attente' && (
                                                                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                                            <Button
                                                                                variant="contained"
                                                                                color="primary"
                                                                                onClick={() => handleConfirm(appt.id)}
                                                                            >
                                                                                Confirmer
                                                                            </Button>
                                                                            <Button
                                                                                variant="outlined"
                                                                                color="error"
                                                                                onClick={() => handleCancel(appt.id)}
                                                                            >
                                                                                Annuler
                                                                            </Button>
                                                                        </Box>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Box>
                        )}

                        {/* Section Notifications */}
                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, px: { xs: 1, sm: 2 } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                style={{ flex: 1 }}
                            >
                                <Card sx={{ boxShadow: 3, width: '100%', p: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            <NotificationsIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                                            Notifications
                                        </Typography>
                                        {notifications.length === 0 ? (
                                            <Typography color="textSecondary">Aucune notification.</Typography>
                                        ) : (
                                            <List>
                                                {notifications.map((notification) => (
                                                    <div key={notification.id}>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={notification.message}
                                                                secondary={notification.date}
                                                            />
                                                        </ListItem>
                                                        <Divider />
                                                    </div>
                                                ))}
                                            </List>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default DoctorDashboard;