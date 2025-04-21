package com.medical_app.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.medical_app.dao.UtilisateurRepository;
import com.medical_app.entities.Utilisateur;

@Service
public class UtilisateurService {

    private static final Logger logger = LoggerFactory.getLogger(UtilisateurService.class);

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> findByStatut(String statut) {
        logger.info("Recherche des utilisateurs avec statut : {}", statut);
        List<Utilisateur> result = utilisateurRepository.findByStatut(statut);
        logger.info("Nombre d'utilisateurs trouvés avec statut {} : {}", statut, result.size());
        return result;
    }

    public Utilisateur save(Utilisateur utilisateur) {
        logger.info("Enregistrement de l'utilisateur : {}", utilisateur.getEmail());
        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);
        logger.info("Utilisateur enregistré avec succès : {}", savedUtilisateur.getEmail());
        return savedUtilisateur;
    }
    
    public List<Utilisateur> findByRoleAndStatut(String role, String statut) {
        logger.info("Recherche des utilisateurs avec rôle : {} et statut : {}", role, statut);
        List<Utilisateur> result = utilisateurRepository.findByRoleAndStatut(role, statut);
        logger.info("Nombre d'utilisateurs trouvés avec rôle {} et statut {} : {}", role, statut, result.size());
        return result;
    }
    
    public Utilisateur findByEmail(String email) {
        logger.info("Recherche de l'utilisateur avec email : {}", email);
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email).orElse(null);
        if (utilisateur == null) {
            logger.info("Aucun utilisateur trouvé pour email : {}", email);
        } else {
            logger.info("Utilisateur trouvé avec email : {}", email);
        }
        return utilisateur;
    }

    public Utilisateur findById(Long id) {
        logger.info("Recherche de l'utilisateur avec ID : {}", id);
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Utilisateur non trouvé pour ID : {}", id);
                    return new RuntimeException("Utilisateur non trouvé");
                });
        logger.info("Utilisateur trouvé avec ID : {}", id);
        return utilisateur;
    }
}