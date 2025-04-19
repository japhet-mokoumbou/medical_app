import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, MenuItem } from '@mui/material';
import axios from 'axios';

const PlanifierRendezVous = () => {
    const [rendezVous, setRendezVous] = useState({
        date: '',
        heure: '',
        patientId: '',
        medecinId: '',
        createurId: localStorage.getItem('userId') || '' // Ajout de createurId
    });
    const [patients, setPatients] = useState([]);
    const [medecins, setMedecins] = useState([]);
    const token = localStorage.getItem('token');

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/utilisateurs/role/PATIENT', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPatients(response.data);
            console.log('Patients chargés :', response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des patients :', error);
            alert('Erreur lors de la récupération des patients');
        }
    };

    const fetchMedecins = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/utilisateurs/role/MEDECIN', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMedecins(response.data);
            console.log('Médecins chargés :', response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des médecins :', error);
            alert('Erreur lors de la récupération des médecins');
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
            alert('Erreur lors de la planification du rendez-vous');
        }
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        } else {
            fetchPatients();
            fetchMedecins();
        }
    }, []);

    return (
        <Container>
            <Typography variant="h4">Planifier un rendez-vous</Typography>
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
                >
                    {patients && patients.length > 0 ? (
                        patients.map((patient) => (
                            <MenuItem key={patient.id} value={patient.id}>
                                {patient.nom} {patient.prenom}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="" disabled>
                            Aucun patient disponible
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
                >
                    {medecins && medecins.length > 0 ? (
                        medecins.map((medecin) => (
                            <MenuItem key={medecin.id} value={medecin.id}>
                                {medecin.nom} {medecin.prenom}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="" disabled>
                            Aucun médecin disponible
                        </MenuItem>
                    )}
                </TextField>
                <Button type="submit" variant="contained" color="primary">
                    Planifier
                </Button>
            </form>
        </Container>
    );
};

export default PlanifierRendezVous;