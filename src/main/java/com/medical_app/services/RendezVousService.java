package com.medical_app.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medical_app.dao.RendezVousRepository;
import com.medical_app.entities.RendezVous;

@Service
public class RendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    public RendezVous save(RendezVous rendezVous) {
        return rendezVousRepository.save(rendezVous);
    }
    
    public List<RendezVous> findByPatientId(Long patientId) {
        return rendezVousRepository.findByPatientId(patientId);
    }

    public List<RendezVous> findByMedecinId(Long medecinId) {
        return rendezVousRepository.findByMedecinId(medecinId);
    }

    public List<RendezVous> findByCreateurId(Long createurId) {
        return rendezVousRepository.findByCreateurId(createurId);
    }
    
    public List<RendezVous> findAll() {
        return rendezVousRepository.findAll();
    }
}
