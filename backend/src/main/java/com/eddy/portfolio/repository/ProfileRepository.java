package com.eddy.portfolio.repository;

import com.eddy.portfolio.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    /** Le portfolio n'a qu'une fiche : on prend la plus ancienne. */
    Optional<Profile> findFirstByOrderByIdAsc();
}
