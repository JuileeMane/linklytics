package com.linklytics.config;

import com.linklytics.entity.*;
import com.linklytics.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LinkRepository linkRepository;
    private final ClickEventRepository clickEventRepository;
    private final FolderRepository folderRepository;
    private final TagRepository tagRepository;
    private final CampaignRepository campaignRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data generation.");
            return;
        }

        log.info("Initializing LinkLytics database with default seed data...");

        // 1. Seed Admin User
        User admin = User.builder()
                .name("Platform Administrator")
                .email("admin@linklytics.com")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_ADMIN)
                .active(true)
                .build();
        admin = userRepository.save(admin);

        // 2. Seed Demo User
        User demo = User.builder()
                .name("Alex Developer")
                .email("demo@linklytics.com")
                .passwordHash(passwordEncoder.encode("Demo@123"))
                .role(Role.ROLE_USER)
                .active(true)
                .build();
        demo = userRepository.save(demo);

        // 3. Seed Folders for Demo User
        Folder devDocs = folderRepository.save(Folder.builder().name("Developer Docs").color("#3B82F6").user(demo).build());
        Folder social = folderRepository.save(Folder.builder().name("Social Media").color("#8B5CF6").user(demo).build());
        Folder marketing = folderRepository.save(Folder.builder().name("Marketing").color("#10B981").user(demo).build());

        // 4. Seed Tags for Demo User
        Tag tagReact = tagRepository.save(Tag.builder().name("react").color("#06B6D4").user(demo).build());
        Tag tagSpring = tagRepository.save(Tag.builder().name("spring-boot").color("#10B981").user(demo).build());
        Tag tagGithub = tagRepository.save(Tag.builder().name("github").color("#6366F1").user(demo).build());
        Tag tagCloud = tagRepository.save(Tag.builder().name("cloud").color("#F59E0B").user(demo).build());

        // 5. Seed Campaign
        Campaign campaign = campaignRepository.save(Campaign.builder()
                .name("Spring 2026 Developer Showcase")
                .description("Promotion campaign for academic mini-project presentation and developer community")
                .user(demo)
                .build());

        // 6. Seed Sample Links
        List<LinkSeed> linkSeeds = List.of(
                new LinkSeed("https://react.dev/learn", "react-docs", "React Official Documentation", devDocs, Set.of(tagReact), 142),
                new LinkSeed("https://github.com/spring-projects/spring-boot", "springboot-repo", "Spring Boot GitHub Repository", devDocs, Set.of(tagSpring, tagGithub), 185),
                new LinkSeed("https://postgresql.org/docs", "postgres-manual", "PostgreSQL 16 Reference Manual", devDocs, Set.of(tagCloud), 98),
                new LinkSeed("https://render.com/docs", "render-deploy", "Render Cloud Hosting Quickstart", marketing, Set.of(tagCloud), 64),
                new LinkSeed("https://developer.mozilla.org/en-US/docs/Web/JavaScript", "mdn-js", "MDN JavaScript Documentation", social, Set.of(tagReact), 115)
        );

        String[] browsers = {"Chrome", "Chrome", "Firefox", "Safari", "Edge", "Samsung Internet"};
        String[] oss = {"Windows", "Windows", "macOS", "Linux", "iOS", "Android"};
        String[] devices = {"Desktop", "Desktop", "Mobile", "Mobile", "Tablet"};
        String[] referrers = {"Direct", "Google", "LinkedIn", "X / Twitter", "GitHub", "Direct"};
        String[] countries = {"India", "United States", "Germany", "United Kingdom", "Canada"};

        Random rand = new Random(42); // deterministic seed for reproducibility

        for (LinkSeed seed : linkSeeds) {
            Link link = Link.builder()
                    .originalUrl(seed.url)
                    .shortCode(seed.alias)
                    .customAlias(seed.alias)
                    .title(seed.title)
                    .user(demo)
                    .folder(seed.folder)
                    .campaign(campaign)
                    .tags(new HashSet<>(seed.tags))
                    .active(true)
                    .archived(false)
                    .favorite(seed.alias.contains("react") || seed.alias.contains("spring"))
                    .clickCount(seed.clicks)
                    .build();

            link = linkRepository.save(link);

            // Generate realistic historical click events for the link
            for (int i = 0; i < seed.clicks; i++) {
                int daysAgo = rand.nextInt(30);
                int hoursAgo = rand.nextInt(24);
                int minutesAgo = rand.nextInt(60);
                LocalDateTime clickTime = LocalDateTime.now().minusDays(daysAgo).minusHours(hoursAgo).minusMinutes(minutesAgo);

                String browser = browsers[rand.nextInt(browsers.length)];
                String os = oss[rand.nextInt(oss.length)];
                String device = devices[rand.nextInt(devices.length)];
                String referrer = referrers[rand.nextInt(referrers.length)];
                String country = countries[rand.nextInt(countries.length)];
                String visitorHash = "visitor-" + rand.nextInt(40); // 40 unique visitors total

                ClickEvent event = ClickEvent.builder()
                        .link(link)
                        .clickedAt(clickTime)
                        .browser(browser)
                        .operatingSystem(os)
                        .deviceType(device)
                        .referrer(referrer)
                        .country(country)
                        .visitorHash(visitorHash)
                        .userAgent("Mozilla/5.0 (" + os + "; rv:100.0) Gecko/20100101 " + browser)
                        .build();

                clickEventRepository.save(event);
            }
        }

        log.info("Database seeding completed! Seeded: 1 admin, 1 demo user, 3 folders, 4 tags, 1 campaign, 5 links, and 604 realistic click events.");
    }

    private record LinkSeed(String url, String alias, String title, Folder folder, Set<Tag> tags, int clicks) {}
}
