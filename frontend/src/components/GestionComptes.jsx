import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const GestionComptes = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const token = localStorage.getItem('token');

    const fetchUtilisateursEnAttente = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/utilisateurs/en-attente', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUtilisateurs(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            alert('Erreur lors de la récupération des utilisateurs');
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
            alert('Utilisateur validé !');
        } catch (error) {
            console.error('Erreur lors de la validation :', error);
            alert('Erreur lors de la validation');
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
            alert('Erreur lors du rejet');
        }
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        } else {
            fetchUtilisateursEnAttente();
        }
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'nom', headerName: 'Nom', width: 150 },
        { field: 'prenom', headerName: 'Prénom', width: 150 },
        { field: 'role', headerName: 'Rôle', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleValider(params.row.id)}
                        style={{ marginRight: 10 }}
                    >
                        Valider
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleRejeter(params.row.id)}
                    >
                        Rejeter
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Gestion des comptes
            </Typography>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={utilisateurs}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </div>
        </Container>
    );
};

export default GestionComptes;