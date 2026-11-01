package com.linklytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LinkLyticsApplication {

    public static void main(String[] args) {
        SpringApplication.run(LinkLyticsApplication.class, args);
    }
}
