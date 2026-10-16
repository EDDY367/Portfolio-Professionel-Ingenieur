package com.eddy.portfolio.repository;

import com.eddy.portfolio.model.Skill;

public interface SkillRepository extends OrderedContentRepository<Skill> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
