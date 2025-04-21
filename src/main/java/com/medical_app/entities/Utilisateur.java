package com.medical_app.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String nom;
    private String prenom;
    private String role;
    private String statut;

    @OneToMany(mappedBy = "patient")
    @JsonIgnore
    private List<RendezVous> rendezVousPatient;

    @OneToMany(mappedBy = "medecin")
    @JsonIgnore
    private List<RendezVous> rendezVousMedecin;

    @OneToMany(mappedBy = "createur")
    @JsonIgnore
    private List<RendezVous> rendezVousCreateur;

    // Constructeurs, getters et setters
    public Utilisateur() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public List<RendezVous> getRendezVousPatient() {
        return rendezVousPatient;
    }

    public void setRendezVousPatient(List<RendezVous> rendezVousPatient) {
        this.rendezVousPatient = rendezVousPatient;
    }

    public List<RendezVous> getRendezVousMedecin() {
        return rendezVousMedecin;
    }

    public void setRendezVousMedecin(List<RendezVous> rendezVousMedecin) {
        this.rendezVousMedecin = rendezVousMedecin;
    }

    public List<RendezVous> getRendezVousCreateur() {
        return rendezVousCreateur;
    }

    public void setRendezVousCreateur(List<RendezVous> rendezVousCreateur) {
        this.rendezVousCreateur = rendezVousCreateur;
    }
}