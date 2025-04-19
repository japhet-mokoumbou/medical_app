import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('userId', response.data.id);
            alert('Connexion réussie !');
            // Rediriger en fonction du rôle
            if (response.data.role === 'SECRETAIRE') {
                navigate('/planifier-rendezvous');
            } else if (response.data.role === 'PATIENT') {
                navigate('/patient-dashboard'); // Redirection vers le tableau de bord du patient
            } else if (response.data.role === 'MEDECIN') {
                navigate('/doctor-dashboard'); // À modifier plus tard pour un tableau de bord médecin
            } else if (response.data.role === 'ADMIN') {
                navigate('/gestion-comptes');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            if (error.response && error.response.status === 401) {
                setError('Identifiants incorrects. Veuillez réessayer.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
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
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2,
                        boxShadow: 3,
                        mx: 'auto',
                    }}
                >
                    <LockOutlinedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Connexion
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={credentials.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Mot de passe"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 1, mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 1, py: 1.5 }}
                        >
                            Se connecter
                        </Button>
                        <Typography sx={{ mt: 2 }}>
                            Pas de compte ?{' '}
                            <Link href="/register" underline="hover">
                                S'inscrire
                            </Link>
                        </Typography>
                    </form>
                </Card>
            </motion.div>
        </Box>
    );
};

export default Login;