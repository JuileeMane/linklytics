package com.linklytics.service;

import com.linklytics.dto.request.CreateCampaignRequest;
import com.linklytics.dto.response.CampaignResponse;
import com.linklytics.entity.Campaign;
import com.linklytics.entity.User;
import com.linklytics.exception.BadRequestException;
import com.linklytics.exception.ResourceNotFoundException;
import com.linklytics.repository.CampaignRepository;
import com.linklytics.repository.LinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final LinkRepository linkRepository;

    @Transactional(readOnly = true)
    public List<CampaignResponse> getCampaigns(User user) {
        return campaignRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public CampaignResponse createCampaign(User user, CreateCampaignRequest request) {
        String name = request.getName().trim();
        if (campaignRepository.existsByNameAndUser(name, user)) {
            throw new BadRequestException("A campaign with this name already exists.");
        }

        Campaign campaign = Campaign.builder()
                .name(name)
                .description(request.getDescription())
                .user(user)
                .build();

        return mapToResponse(campaignRepository.save(campaign));
    }

    @Transactional
    public CampaignResponse updateCampaign(User user, Long id, CreateCampaignRequest request) {
        Campaign campaign = campaignRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));

        String name = request.getName().trim();
        if (!campaign.getName().equalsIgnoreCase(name) && campaignRepository.existsByNameAndUser(name, user)) {
            throw new BadRequestException("A campaign with this name already exists.");
        }

        campaign.setName(name);
        campaign.setDescription(request.getDescription());

        return mapToResponse(campaignRepository.save(campaign));
    }

    @Transactional
    public void deleteCampaign(User user, Long id) {
        Campaign campaign = campaignRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));

        linkRepository.findByCampaign(campaign).forEach(l -> l.setCampaign(null));
        campaignRepository.delete(campaign);
    }

    public CampaignResponse mapToResponse(Campaign campaign) {
        if (campaign == null) return null;
        long linkCount = linkRepository.countByCampaign(campaign);
        long clickCount = linkRepository.sumClicksByCampaign(campaign);

        return CampaignResponse.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .description(campaign.getDescription())
                .totalLinks(linkCount)
                .totalClicks(clickCount)
                .createdAt(campaign.getCreatedAt())
                .updatedAt(campaign.getUpdatedAt())
                .build();
    }
}
