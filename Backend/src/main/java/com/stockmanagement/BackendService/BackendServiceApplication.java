package com.stockmanagement.BackendService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendServiceApplication {

	public static void main(String[] args) {
		// 1. FORCE the connection string here (Paste your REAL Atlas string below)
        // Ensure you remove the < > brackets!
        // System.setProperty("spring.data.mongodb.uri", "mongodb+srv://yennampraneeth:Praneeth99@stockmanagement.wcfmpxw.mongodb.net/StockManagement?retryWrites=true&w=majority");
		SpringApplication.run(BackendServiceApplication.class, args);
	}

}
