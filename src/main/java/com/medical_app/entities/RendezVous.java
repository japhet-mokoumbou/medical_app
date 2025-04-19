package com.medical_app.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
public class RendezVous {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String date;
    private String heure;
    private String statut;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonManagedReference
    private Utilisateur patient;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    @JsonManagedReference
    private Utilisateur medecin;

    @ManyToOne
    @JoinColumn(name = "createur_id")
    @JsonManagedReference
    private Utilisateur createur;

    // Constructeurs, getters et setters
    public Utilisateur getCreateur() {
        return createur;
    }

    public void setCreateur(Utilisateur createur) {
        this.createur = createur;
    }

    public RendezVous() {}

    public RendezVous(String date, String heure, String statut, Utilisateur patient, Utilisateur medecin) {
        this.date = date;
        this.heure = heure;
        this.statut = statut;
        this.patient = patient;
        this.medecin = medecin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getHeure() {
        return heure;
    }

    public void setHeure(String heure) {
        this.heure = heure;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Utilisateur getPatient() {
        return patient;
    }

    public void setPatient(Utilisateur patient) {
        this.patient = patient;
    }

    public Utilisateur getMedecin() {
        return medecin;
    }

    public void setMedecin(Utilisateur medecin) {
        this.medecin = medecin;
    }
}