import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    TextField,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { motion } from 'framer-motion';

const PlanifierRendezVous = () => {
    const [rendezVous, setRendezVous] = useState({
        date: '',
        heure: '',
        patientId: '',
        medecinId: '',
        createurId: localStorage.getItem('userId') || ''
    });
    const [patients, setPatients] = useState([]);
    const [medecins, setMedecins] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [loadingMedecins, setLoadingMedecins] = useState(true);
    const [errorPatients, setErrorPatients] = useState('');
    const [errorMedecins, setErrorMedecins] = useState('');
    const token = localStorage.getItem('token');

    const fetchPatients = async () => {
        setLoadingPatients(true);
        setErrorPatients('');
        try {
            const response = await axios.get('http://localhost:8080/api/utilisateurs/role/PATIENT', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des patients :', error);
            setErrorPatients('Erreur lors de la récupération des patients.');
        } finally {
            setLoadingPatients(false);
        }
    };

    const fetchMedecins = async () => {
        setLoadingMedecins(true);
        setErrorMedecins('');
        try {
            const response = await axios.get('http://localhost:8080/api/utilisateurs/role/MEDECIN', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMedecins(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des médecins :', error);
            setErrorMedecins('Erreur lors de la récupération des médecins.');
        } finally {
            setLoadingMedecins(false);
        }
    };

    const handleChange = (e) => {
        setRendezVous({ ...rendezVous, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rendezVous.patientId || !rendezVous.medecinId) {
            alert('Veuillez sélectionner un patient et un médecin.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/api/rendezvous', rendezVous, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Rendez-vous créé :', response.data);
            alert('Rendez-vous planifié !');
            setRendezVous({
                date: '',
                heure: '',
                patientId: '',
                medecinId: '',
                createurId: localStorage.getItem('userId') || ''
            });
        } catch (error) {
            console.error('Erreur lors de la planification :', error);
            alert('Erreur lors de la planification du rendez-vous.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        } else {
            fetchPatients();
            fetchMedecins();
        }
    }, [token]);

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5', width: '100vw', m: 0, p: 0 }}>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2', width: '100%' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <EventNoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Planifier un rendez-vous
                    </Typography>
                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card sx={{ boxShadow: 3, width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Informations du rendez-vous
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={rendezVous.date}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                                <TextField
                                    label="Heure"
                                    name="heure"
                                    type="time"
                                    value={rendezVous.heure}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                                <TextField
                                    select
                                    label="Patient"
                                    name="patientId"
                                    value={rendezVous.patientId}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    disabled={loadingPatients || errorPatients !== '' || patients.length === 0}
                                    helperText={errorPatients || (loadingPatients ? 'Chargement des patients...' : patients.length === 0 ? 'Aucun patient disponible' : '')}
                                >
                                    {patients && patients.map((patient) => (
                                        <MenuItem key={patient.id} value={patient.id}>
                                            {patient.nom} {patient.prenom}
                                        </MenuItem>
                                    ))}
                                    {(loadingPatients || errorPatients !== '' || patients.length === 0) && (
                                        <MenuItem value="" disabled>
                                            {loadingPatients ? <CircularProgress size={20} sx={{ mr: 1 }} /> : errorPatients || 'Aucun patient disponible'}
                                        </MenuItem>
                                    )}
                                </TextField>
                                <TextField
                                    select
                                    label="Médecin"
                                    name="medecinId"
                                    value={rendezVous.medecinId}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    disabled={loadingMedecins || errorMedecins !== '' || medecins.length === 0}
                                    helperText={errorMedecins || (loadingMedecins ? 'Chargement des médecins...' : medecins.length === 0 ? 'Aucun médecin disponible' : '')}
                                >
                                    {medecins && medecins.map((medecin) => (
                                        <MenuItem key={medecin.id} value={medecin.id}>
                                            {medecin.nom} {medecin.prenom}
                                        </MenuItem>
                                    ))}
                                    {(loadingMedecins || errorMedecins !== '' || medecins.length === 0) && (
                                        <MenuItem value="" disabled>
                                            {loadingMedecins ? <CircularProgress size={20} sx={{ mr: 1 }} /> : errorMedecins || 'Aucun médecin disponible'}
                                        </MenuItem>
                                    )}
                                </TextField>
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Planifier
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </Box>
        </Box>
    );
};

export default PlanifierRendezVous;