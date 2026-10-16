package com.eddy.portfolio.service;

import com.eddy.portfolio.dto.EducationDto;
import com.eddy.portfolio.exception.InvalidDataException;
import com.eddy.portfolio.model.Education;
import com.eddy.portfolio.repository.EducationRepository;
import org.springframework.stereotype.Service;

@Service
public class EducationService extends OrderedContentService<Education, EducationDto.Request, EducationDto.Response> {

    public EducationService(EducationRepository educationRepository) {
        super(educationRepository, "Formation");
    }

    @Override
    protected Education newEntity() {
        return new Education();
    }

    @Override
    protected void apply(EducationDto.Request request, Education entity) {
        request.applyTo(entity);
    }

    @Override
    protected EducationDto.Response toResponse(Education entity) {
        return EducationDto.Response.from(entity);
    }

    @Override
    protected void validateBeforeSave(EducationDto.Request request, Education entity) {
        if (request.endYear() != null && request.endYear() < request.startYear()) {
            throw new InvalidDataException("L'annee de fin ne peut pas preceder l'annee de debut");
        }
    }
}
