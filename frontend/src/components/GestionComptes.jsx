import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { motion } from 'framer-motion';

const GestionComptes = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const fetchUtilisateursEnAttente = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8080/api/admin/utilisateurs/en-attente', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUtilisateurs(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            setError('Erreur lors de la récupération des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    const handleValider = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/utilisateurs/${id}/valider`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchUtilisateursEnAttente();
            // alert('Utilisateur validé !');
        } catch (error) {
            console.error('Erreur lors de la validation :', error);
            alert('Erreur lors de la validation.');
        }
    };

    const handleRejeter = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/utilisateurs/${id}/rejeter`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchUtilisateursEnAttente();
            alert('Utilisateur rejeté !');
        } catch (error) {
            console.error('Erreur lors du rejet :', error);
            alert('Erreur lors du rejet.');
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
            fetchUtilisateursEnAttente();
        }
    }, [token]);

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5', width: '100vw', m: 0, p: 0 }}>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2', width: '100%' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <AdminPanelSettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Gestion des comptes en attente
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
                    <Card sx={{ boxShadow: 3, width: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Utilisateurs en attente de validation
                            </Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : utilisateurs.length === 0 ? (
                                <Typography color="textSecondary">Aucun utilisateur en attente de validation.</Typography>
                            ) : (
                                <List>
                                    {utilisateurs.map((utilisateur) => (
                                        <div key={utilisateur.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <Box>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="valider"
                                                            onClick={() => handleValider(utilisateur.id)}
                                                            sx={{ color: 'success.main', mr: 1 }}
                                                        >
                                                            <CheckCircleOutlineIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="rejeter"
                                                            onClick={() => handleRejeter(utilisateur.id)}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <BlockIcon />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            >
                                                <ListItemText
                                                    primary={`${utilisateur.prenom} ${utilisateur.nom}`}
                                                    secondary={`Email: ${utilisateur.email} - Rôle: ${utilisateur.role}`}
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
        </Box>
    );
};

export default GestionComptes;