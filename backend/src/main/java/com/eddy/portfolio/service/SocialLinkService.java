package com.eddy.portfolio.service;

import com.eddy.portfolio.dto.SocialLinkDto;
import com.eddy.portfolio.model.SocialLink;
import com.eddy.portfolio.repository.SocialLinkRepository;
import org.springframework.stereotype.Service;

@Service
public class SocialLinkService extends OrderedContentService<SocialLink, SocialLinkDto.Request, SocialLinkDto.Response> {

    public SocialLinkService(SocialLinkRepository socialLinkRepository) {
        super(socialLinkRepository, "Lien");
    }

    @Override
    protected SocialLink newEntity() {
        return new SocialLink();
    }

    @Override
    protected void apply(SocialLinkDto.Request request, SocialLink entity) {
        request.applyTo(entity);
    }

    @Override
    protected SocialLinkDto.Response toResponse(SocialLink entity) {
        return SocialLinkDto.Response.from(entity);
    }
}
