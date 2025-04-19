package com.medical_app.dao;

public class RendezVousDTO {
    private String date;
    private String heure;
    private Long patientId;
    private Long medecinId;
    private Long createurId; // Ajout du champ createurId

    public Long getCreateurId() {
        return createurId;
    }

    public void setCreateurId(Long createurId) {
        this.createurId = createurId;
    }

    // Getters et setters
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

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getMedecinId() {
        return medecinId;
    }

    public void setMedecinId(Long medecinId) {
        this.medecinId = medecinId;
    }
}
