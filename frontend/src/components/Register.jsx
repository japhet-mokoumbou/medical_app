import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        role: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:8080/api/auth/register', formData);
            alert('Inscription réussie, en attente de validation.');
        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
            setError('Erreur lors de l\'inscription. Veuillez réessayer.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                position: 'fixed',
                top: 0,
                left: 0,
                m: 0,
                p: 0,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Card
                    sx={{
                        maxWidth: 400,
                        p: 1.5,
                        textAlign: 'center',
                        borderRadius: 2,
                        boxShadow: 3,
                        mx: 'auto',
                    }}
                >
                    <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 0.5 }} /> {/* Changement de secondary à primary */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 0.5 }}>
                        Inscription
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            required
                            sx={{ mb: 0.5 }}
                        />
                        <TextField
                            label="Mot de passe"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            required
                            sx={{ mb: 0.5 }}
                        />
                        <TextField
                            label="Nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            required
                            sx={{ mb: 0.5 }}
                        />
                        <TextField
                            label="Prénom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            required
                            sx={{ mb: 0.5 }}
                        />
                        <FormControl fullWidth margin="normal" sx={{ mb: 0.5 }}>
                            <InputLabel>Rôle</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="Rôle"
                                required
                            >
                                <MenuItem value="MEDECIN">Médecin</MenuItem>
                                <MenuItem value="SECRETAIRE">Secrétaire</MenuItem>
                                <MenuItem value="PATIENT">Patient</MenuItem>
                            </Select>
                        </FormControl>
                        {error && (
                            <Typography color="error" sx={{ mt: 0.5, mb: 0.5 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary" // Changement de secondary à primary
                            fullWidth
                            sx={{ mt: 0.5, mb: 0.5, py: 0.5 }}
                        >
                            S'inscrire
                        </Button>
                        <Typography sx={{ mt: 0.5 }}>
                            Déjà un compte ?{' '}
                            <Link href="/login" underline="hover">
                                Se connecter
                            </Link>
                        </Typography>
                    </form>
                </Card>
            </motion.div>
        </Box>
    );
};

export default Register;