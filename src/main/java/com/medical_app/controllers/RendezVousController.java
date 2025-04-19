package com.medical_app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.medical_app.dao.RendezVousDTO;
import com.medical_app.entities.RendezVous;
import com.medical_app.entities.Utilisateur;
import com.medical_app.services.RendezVousService;
import com.medical_app.services.UtilisateurService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RendezVousController {

    @Autowired
    private RendezVousService rendezVousService;

    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/rendezvous")
    @PreAuthorize("hasRole('SECRETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<RendezVous> planifierRendezVous(@RequestBody RendezVousDTO rendezVousDTO) {
        Utilisateur patient = utilisateurService.findById(rendezVousDTO.getPatientId());
        if (!patient.getRole().equals("PATIENT")) {
            throw new RuntimeException("L'utilisateur sélectionné n'est pas un patient");
        }

        Utilisateur medecin = utilisateurService.findById(rendezVousDTO.getMedecinId());
        if (!medecin.getRole().equals("MEDECIN")) {
            throw new RuntimeException("L'utilisateur sélectionné n'est pas un médecin");
        }

        Utilisateur createur = utilisateurService.findById(rendezVousDTO.getCreateurId());
        if (!createur.getRole().equals("SECRETAIRE") && !createur.getRole().equals("ADMIN")) {
            throw new RuntimeException("L'utilisateur sélectionné n'est pas un secrétaire ou admin");
        }

        RendezVous rendezVous = new RendezVous();
        rendezVous.setDate(rendezVousDTO.getDate());
        rendezVous.setHeure(rendezVousDTO.getHeure());
        rendezVous.setStatut("PLANIFIE");
        rendezVous.setPatient(patient);
        rendezVous.setMedecin(medecin);
        rendezVous.setCreateur(createur);

        RendezVous savedRendezVous = rendezVousService.save(rendezVous);
        return ResponseEntity.ok(savedRendezVous);
    }

    @GetMapping("/utilisateurs/role/{role}")
    @PreAuthorize("hasRole('SECRETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<List<Utilisateur>> getUtilisateursByRole(@PathVariable String role) {
        List<Utilisateur> utilisateurs = utilisateurService.findByRoleAndStatut(role, "VALIDE");
        return ResponseEntity.ok(utilisateurs);
    }
    @GetMapping("/rendezvous/mes-rendezvous")
    @PreAuthorize("hasAnyRole('PATIENT', 'MEDECIN', 'SECRETAIRE', 'ADMIN')")
    public ResponseEntity<List<RendezVous>> getMesRendezVous() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur utilisateur = utilisateurService.findByEmail(email);
        String role = utilisateur.getRole();
        Long userId = utilisateur.getId();

        List<RendezVous> rendezVous;
        if (role.equals("PATIENT")) {
            rendezVous = rendezVousService.findByPatientId(userId);
        } else if (role.equals("MEDECIN")) {
            rendezVous = rendezVousService.findByMedecinId(userId);
        } else if (role.equals("SECRETAIRE") || role.equals("ADMIN")) {
            rendezVous = rendezVousService.findAll();
        } else {
            throw new RuntimeException("Rôle non autorisé");
        }

        return ResponseEntity.ok(rendezVous);
    }
}
