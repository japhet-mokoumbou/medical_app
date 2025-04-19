package com.medical_app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.medical_app.entities.Utilisateur;
import com.medical_app.services.UtilisateurService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping("/utilisateurs/en-attente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Utilisateur>> getUtilisateursEnAttente() {
        List<Utilisateur> utilisateurs = utilisateurService.findByStatut("EN_ATTENTE");
        return ResponseEntity.ok(utilisateurs);
    }

    @PutMapping("/utilisateurs/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Utilisateur> validerUtilisateur(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.findById(id);
        utilisateur.setStatut("VALIDE");
        utilisateurService.save(utilisateur);
        return ResponseEntity.ok(utilisateur);
    }

    @PutMapping("/utilisateurs/{id}/rejeter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Utilisateur> rejeterUtilisateur(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.findById(id);
        utilisateur.setStatut("REJETE");
        utilisateurService.save(utilisateur);
        return ResponseEntity.ok(utilisateur);
    }
}
