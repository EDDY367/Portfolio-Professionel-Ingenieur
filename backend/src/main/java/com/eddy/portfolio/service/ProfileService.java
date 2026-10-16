package com.eddy.portfolio.service;

import com.eddy.portfolio.dto.ProfileDto;
import com.eddy.portfolio.exception.ResourceNotFoundException;
import com.eddy.portfolio.model.Profile;
import com.eddy.portfolio.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public ProfileDto.Response get() {
        return profileRepository.findFirstByOrderByIdAsc()
                .map(ProfileDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Profil", "principal"));
    }

    /** Cree la fiche si elle n'existe pas encore, sinon la met a jour. */
    @Transactional
    public ProfileDto.Response save(ProfileDto.Request request) {
        Profile profile = profileRepository.findFirstByOrderByIdAsc().orElseGet(Profile::new);
        request.applyTo(profile);
        return ProfileDto.Response.from(profileRepository.save(profile));
    }
}
