package com.medical_app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.medical_app.dao.UtilisateurRepository;
import com.medical_app.entities.Utilisateur;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> findByStatut(String statut) {
        return utilisateurRepository.findByStatut(statut);
    }

    public Utilisateur save(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }
    
    public List<Utilisateur> findByRoleAndStatut(String role, String statut) {
        return utilisateurRepository.findByRoleAndStatut(role, statut);
    }
    
    public Utilisateur findByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public Utilisateur findById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
}
