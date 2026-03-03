package com.stockmanagement.BackendService.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class ConfigDump {

    @Bean
    ApplicationRunner dumpMongo(Environment env) {
        return args -> {
            System.out.println(">>> RESOLVED spring.data.mongodb.uri = " + env.getProperty("spring.data.mongodb.uri"));
            System.out.println(">>> RESOLVED spring.data.mongodb.host = " + env.getProperty("spring.data.mongodb.host"));
            System.out.println(">>> RESOLVED spring.data.mongodb.port = " + env.getProperty("spring.data.mongodb.port"));
            System.out.println(">>> RESOLVED spring.data.mongodb.database = " + env.getProperty("spring.data.mongodb.database"));
        };
    }
}
