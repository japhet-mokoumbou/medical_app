import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const ListeRendezVous = () => {
    const [rendezvous, setRendezvous] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRendezvous = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/rendezvous/mes-rendezvous', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Rendez-vous chargés :', response.data);
                setRendezvous(Array.isArray(response.data) ? response.data : []);
                setTimeout(() => setIsLoading(false), 100);
            } catch (error) {
                console.error('Erreur lors de la récupération des rendez-vous :', error);
                if (error.response) {
                    console.log('Statut:', error.response.status);
                    console.log('Données:', error.response.data);
                }
                setRendezvous([]);
                setTimeout(() => setIsLoading(false), 100);
            }
        };

        fetchRendezvous();
    }, [token]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'heure', headerName: 'Heure', width: 150 },
        {
            field: 'patient',
            headerName: 'Patient',
            width: 200,
            renderCell: (params) => {
                console.log('Row in renderCell (Patient):', params?.row);
                const patient = params?.row?.patient;
                return patient && patient.nom && patient.prenom 
                    ? `${patient.nom} ${patient.prenom}` 
                    : 'Inconnu';
            },
        },
        {
            field: 'medecin',
            headerName: 'Médecin',
            width: 200,
            renderCell: (params) => {
                console.log('Row in renderCell (Medecin):', params?.row);
                const medecin = params?.row?.medecin;
                return medecin && medecin.nom && medecin.prenom 
                    ? `${medecin.nom} ${medecin.prenom}` 
                    : 'Inconnu';
            },
        },
        {
            field: 'createur',
            headerName: 'Créé par',
            width: 200,
            renderCell: (params) => {
                console.log('Row in renderCell (Createur):', params?.row);
                const createur = params?.row?.createur;
                return createur && createur.nom && createur.prenom 
                    ? `${createur.nom} ${createur.prenom}` 
                    : 'Inconnu';
            },
        },
        { field: 'statut', headerName: 'Statut', width: 150 },
    ];

    const formattedRows = rendezvous.map((rdv, index) => {
        const row = {
            ...rdv,
            id: rdv.id ?? index,
        };
        console.log('Row:', row);
        return row;
    });
    console.log('Formatted Rows:', formattedRows);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <h2>Mes Rendez-vous</h2>
            {isLoading ? (
                <p>Chargement...</p>
            ) : Array.isArray(rendezvous) && rendezvous.length > 0 ? (
                <DataGrid
                    rows={formattedRows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            ) : (
                <p>Aucun rendez-vous trouvé.</p>
            )}
        </div>
    );
};

export default ListeRendezVous;