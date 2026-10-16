package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.CertificationDto;
import com.eddy.portfolio.model.Certification;
import com.eddy.portfolio.service.CertificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/certifications")
@Tag(name = "Admin - Certifications")
public class AdminCertificationController
        extends AbstractAdminController<Certification, CertificationDto.Request, CertificationDto.Response> {

    public AdminCertificationController(CertificationService service) {
        super(service);
    }
}
