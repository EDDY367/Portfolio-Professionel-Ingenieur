package com.eddy.portfolio.service;

import com.eddy.portfolio.dto.CertificationDto;
import com.eddy.portfolio.model.Certification;
import com.eddy.portfolio.repository.CertificationRepository;
import org.springframework.stereotype.Service;

@Service
public class CertificationService
        extends OrderedContentService<Certification, CertificationDto.Request, CertificationDto.Response> {

    public CertificationService(CertificationRepository certificationRepository) {
        super(certificationRepository, "Certification");
    }

    @Override
    protected Certification newEntity() {
        return new Certification();
    }

    @Override
    protected void apply(CertificationDto.Request request, Certification entity) {
        request.applyTo(entity);
    }

    @Override
    protected CertificationDto.Response toResponse(Certification entity) {
        return CertificationDto.Response.from(entity);
    }
}
