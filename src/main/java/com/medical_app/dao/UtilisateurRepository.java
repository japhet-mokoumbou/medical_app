package com.medical_app.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.medical_app.entities.Utilisateur;
import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    List<Utilisateur> findByStatut(String statut);
    List<Utilisateur> findByRoleAndStatut(String role, String statut);
    Optional<Utilisateur> findByEmail(String email);
}
