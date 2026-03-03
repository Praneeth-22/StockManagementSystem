package com.stockmanagement.BackendService.repository;

import com.stockmanagement.BackendService.model.Item; // Import the Item model. // This allows us to use the Item class in our repository layer.
import org.springframework.data.mongodb.repository.MongoRepository; // Import the MongoRepository interface. // This allows us to create a repository interface for the Item model that provides CRUD operations and interacts with MongoDB. // This is a Spring Data interface that provides methods for performing CRUD operations on a MongoDB collection.
import org.springframework.stereotype.Repository; // Import the Repository annotation. // This marks the interface as a repository component in the Spring context. // This is a Spring annotation that indicates that this interface is a repository layer component, which interacts with the database.
import java.util.List;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    // By extending MongoRepository, we get basic CRUD operations for free, such as save(), findAll(), findById(), deleteById(), etc.
    // We can also define custom query methods here if needed, such as findByCategory(String category) to find items by their category.

    List<Item> findByCategory(String category); // This is a custom query method that will allow us to find items by their category. // Spring Data will automatically implement this method based on the method name, which follows a specific naming convention.
}
// public class ItemRepository {
    
// }
