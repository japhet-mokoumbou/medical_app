package com.medical_app.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.medical_app.entities.RendezVous;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
	List<RendezVous> findByPatientId(Long patientId);
	List<RendezVous> findByMedecinId(Long medecinId);
	List<RendezVous> findByCreateurId(Long createurId);
	List<RendezVous> findAll();
}
