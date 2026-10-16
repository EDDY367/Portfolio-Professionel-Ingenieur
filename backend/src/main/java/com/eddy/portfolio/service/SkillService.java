package com.eddy.portfolio.service;

import com.eddy.portfolio.dto.SkillDto;
import com.eddy.portfolio.exception.ConflictException;
import com.eddy.portfolio.model.Skill;
import com.eddy.portfolio.repository.SkillRepository;
import org.springframework.stereotype.Service;

@Service
public class SkillService extends OrderedContentService<Skill, SkillDto.Request, SkillDto.Response> {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        super(skillRepository, "Competence");
        this.skillRepository = skillRepository;
    }

    @Override
    protected Skill newEntity() {
        return new Skill();
    }

    @Override
    protected void apply(SkillDto.Request request, Skill entity) {
        request.applyTo(entity);
    }

    @Override
    protected SkillDto.Response toResponse(Skill entity) {
        return SkillDto.Response.from(entity);
    }

    @Override
    protected void validateBeforeSave(SkillDto.Request request, Skill entity) {
        boolean taken = entity.getId() == null
                ? skillRepository.existsByNameIgnoreCase(request.name())
                : skillRepository.existsByNameIgnoreCaseAndIdNot(request.name(), entity.getId());
        if (taken) {
            throw new ConflictException("Une competence portant ce nom existe deja");
        }
    }
}
