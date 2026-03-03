package com.stockmanagement.BackendService.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data ;
import lombok.NoArgsConstructor ;
import lombok.AllArgsConstructor;

@Data // Lombok annotation to generate getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "items")

public class Item {
    @Id
    private String id;
    private String category;
    private String name;
    private String description;
    private String dateAdded;
}
