package com.medical_app.controllers;

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

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Utilisateur> register(@RequestBody Utilisateur utilisateur) {
        utilisateur.setStatut("EN_ATTENTE");
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        Utilisateur savedUtilisateur = utilisateurService.save(utilisateur);
        return ResponseEntity.ok(savedUtilisateur);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDTO loginDTO) {
        System.out.println("Tentative de connexion avec email : " + loginDTO.getEmail());
        System.out.println("Mot de passe saisi : " + loginDTO.getPassword());
        try {
            Utilisateur utilisateur = utilisateurService.findByEmail(loginDTO.getEmail());
            System.out.println("Utilisateur trouvé : " + (utilisateur != null));
            if (utilisateur != null) {
                System.out.println("Mot de passe stocké : " + utilisateur.getPassword());
                System.out.println("Rôle utilisateur : " + utilisateur.getRole());
                System.out.println("Statut utilisateur : " + utilisateur.getStatut());
                if (!utilisateur.getStatut().equals("VALIDE")) {
                    System.out.println("Échec de la connexion : utilisateur non validé (statut : " + utilisateur.getStatut() + ")");
                    Map<String, String> response = new HashMap<>();
                    response.put("error", "Utilisateur non validé. Veuillez attendre la validation par un administrateur.");
                    return ResponseEntity.status(403).body(response);
                }
                boolean passwordMatch = passwordEncoder.matches(loginDTO.getPassword(), utilisateur.getPassword());
                System.out.println("Correspondance mot de passe : " + passwordMatch);
                if (passwordMatch) {
                    String token = jwtService.generateToken(loginDTO.getEmail(), utilisateur.getRole());
                    Map<String, String> response = new HashMap<>();
                    response.put("token", token);
                    response.put("role", utilisateur.getRole());
                    response.put("id", utilisateur.getId().toString());
                    System.out.println("Connexion réussie pour " + loginDTO.getEmail());
                    return ResponseEntity.ok(response);
                } else {
                    System.out.println("Échec de la connexion : mot de passe incorrect");
                    Map<String, String> response = new HashMap<>();
                    response.put("error", "Mot de passe incorrect");
                    return ResponseEntity.status(401).body(response);
                }
            } else {
                System.out.println("Échec de la connexion : utilisateur non trouvé");
                Map<String, String> response = new HashMap<>();
                response.put("error", "Utilisateur non trouvé");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            System.out.println("Erreur lors de la recherche de l'utilisateur : " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", "Erreur serveur : " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/hash-password")
    public String hashPassword(@RequestParam String password) {
        return passwordEncoder.encode(password);
    }
}