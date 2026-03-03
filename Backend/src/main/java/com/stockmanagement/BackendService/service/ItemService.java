package com.stockmanagement.BackendService.service;

import com.stockmanagement.BackendService.model.Item; // Import the Item model. // This allows us to use the Item class in our service layer.
import com.stockmanagement.BackendService.repository.ItemRepository; // Import the ItemRepository. // This allows us to interact with the database through the repository layer.
import java.util.List; 
import org.springframework.beans.factory.annotation.Autowired; // Import the Autowired annotation. // This allows us to inject the ItemRepository into our service class. // This is a Spring annotation that tells the framework to automatically inject the ItemRepository dependency when creating an instance of ItemService.
import org.springframework.stereotype.Service; // Import the Service annotation. // This marks the class as a service component in the Spring context. // This is a Spring annotation that indicates that this class is a service layer component, which contains business logic and interacts with the repository layer.

@Service 
public class ItemService {
    @Autowired
    private ItemRepository itemRepository; // Inject the ItemRepository. // This allows us to use the repository methods to perform CRUD operations on the Item collection in MongoDB.

    // Here we will add methods to handle business logic related to items, such as adding a new item, retrieving items, updating items, and deleting items.

    //fetch all items
    public List<Item> getAllItems() {
        if (itemRepository == null) {
            throw new IllegalStateException("ItemRepository is not initialized");
        }
        return itemRepository.findAll(); // This method will return a list of all items in the database. // This uses the findAll() method provided by the MongoRepository interface, which retrieves all documents from the "items" collection in MongoDB and returns them as a list of Item objects.
    }

    //add new item
    public Item addItem(Item item) {
        return itemRepository.save(item); // This method will save a new item to the database and return the saved item. // This uses the save() method provided by the MongoRepository interface, which saves the given Item object to the "items" collection in MongoDB and returns the saved Item object, which may include an automatically generated ID.
    }
}
