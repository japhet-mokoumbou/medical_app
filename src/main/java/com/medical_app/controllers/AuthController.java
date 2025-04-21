package com.medical_app.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.medical_app.dao.LoginDTO;
import com.medical_app.entities.Utilisateur;
import com.medical_app.services.JwtService;
import com.medical_app.services.UtilisateurService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Utilisateur utilisateur) {
        logger.info("Requête d'inscription reçue pour email : {}", utilisateur.getEmail());
        logger.debug("Données utilisateur reçues : email={}, nom={}, prenom={}, role={}",
                utilisateur.getEmail(), utilisateur.getNom(), utilisateur.getPrenom(), utilisateur.getRole());
        try {
            // Vérifier si l'email existe déjà
            if (utilisateurService.findByEmail(utilisateur.getEmail()) != null) {
                logger.warn("Email déjà utilisé : {}", utilisateur.getEmail());
                Map<String, String> response = new HashMap<>();
                response.put("error", "Cet email est déjà utilisé.");
                return ResponseEntity.status(400).body(response);
            }

            // Définir le statut et encoder le mot de passe
            utilisateur.setStatut("EN_ATTENTE");
            utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
            Utilisateur savedUtilisateur = utilisateurService.save(utilisateur);
            logger.info("Utilisateur enregistré avec succès : {}", savedUtilisateur.getEmail());

            // Générer un token JWT
            String token = jwtService.generateToken(savedUtilisateur.getEmail(), savedUtilisateur.getRole());

            // Construire la réponse
            Map<String, String> response = new HashMap<>();
            response.put("message", "Inscription réussie, en attente de validation.");
            response.put("token", token);
            response.put("role", savedUtilisateur.getRole());
            response.put("id", savedUtilisateur.getId().toString());
            logger.info("Inscription réussie pour : {}", savedUtilisateur.getEmail());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors de l'inscription pour email : {}. Erreur : {}", utilisateur.getEmail(), e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Erreur lors de l'inscription : " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDTO loginDTO) {
        logger.info("Tentative de connexion avec email : {}", loginDTO.getEmail());
        try {
            Utilisateur utilisateur = utilisateurService.findByEmail(loginDTO.getEmail());
            logger.info("Utilisateur trouvé : {}", (utilisateur != null));
            if (utilisateur != null) {
                logger.debug("Mot de passe stocké : {}", utilisateur.getPassword());
                logger.debug("Rôle utilisateur : {}", utilisateur.getRole());
                logger.debug("Statut utilisateur : {}", utilisateur.getStatut());
                if (!utilisateur.getStatut().equals("VALIDE")) {
                    logger.warn("Échec de la connexion : utilisateur non validé (statut : {})", utilisateur.getStatut());
                    Map<String, String> response = new HashMap<>();
                    response.put("error", "Utilisateur non validé. Veuillez attendre la validation par un administrateur.");
                    return ResponseEntity.status(403).body(response);
                }
                boolean passwordMatch = passwordEncoder.matches(loginDTO.getPassword(), utilisateur.getPassword());
                logger.debug("Correspondance mot de passe : {}", passwordMatch);
                if (passwordMatch) {
                    String token = jwtService.generateToken(loginDTO.getEmail(), utilisateur.getRole());
                    Map<String, String> response = new HashMap<>();
                    response.put("token", token);
                    response.put("role", utilisateur.getRole());
                    response.put("id", utilisateur.getId().toString());
                    logger.info("Connexion réussie pour : {}", loginDTO.getEmail());
                    return ResponseEntity.ok(response);
                } else {
                    logger.warn("Échec de la connexion : mot de passe incorrect pour email : {}", loginDTO.getEmail());
                    Map<String, String> response = new HashMap<>();
                    response.put("error", "Mot de passe incorrect");
                    return ResponseEntity.status(401).body(response);
                }
            } else {
                logger.warn("Échec de la connexion : utilisateur non trouvé pour email : {}", loginDTO.getEmail());
                Map<String, String> response = new HashMap<>();
                response.put("error", "Utilisateur non trouvé");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la connexion pour email : {}. Erreur : {}", loginDTO.getEmail(), e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Erreur serveur : " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/hash-password")
    public String hashPassword(@RequestParam String password) {
        logger.info("Requête pour hasher un mot de passe");
        return passwordEncoder.encode(password);
    }
}