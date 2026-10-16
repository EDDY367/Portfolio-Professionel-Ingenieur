package com.eddy.portfolio.service;

import com.eddy.portfolio.dto.ExperienceDto;
import com.eddy.portfolio.exception.InvalidDataException;
import com.eddy.portfolio.model.Experience;
import com.eddy.portfolio.repository.ExperienceRepository;
import org.springframework.stereotype.Service;

@Service
public class ExperienceService extends OrderedContentService<Experience, ExperienceDto.Request, ExperienceDto.Response> {

    public ExperienceService(ExperienceRepository experienceRepository) {
        super(experienceRepository, "Experience");
    }

    @Override
    protected Experience newEntity() {
        return new Experience();
    }

    @Override
    protected void apply(ExperienceDto.Request request, Experience entity) {
        request.applyTo(entity);
    }

    @Override
    protected ExperienceDto.Response toResponse(Experience entity) {
        return ExperienceDto.Response.from(entity);
    }

    @Override
    protected void validateBeforeSave(ExperienceDto.Request request, Experience entity) {
        if (request.endDate() != null && request.endDate().isBefore(request.startDate())) {
            throw new InvalidDataException("La date de fin ne peut pas preceder la date de debut");
        }
    }
}
