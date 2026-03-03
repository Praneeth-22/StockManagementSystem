package com.stockmanagement.BackendService.controller;

import com.stockmanagement.BackendService.model.Item; // Import the Item model. // This allows us to use the Item class in our controller layer.
import com.stockmanagement.BackendService.service.ItemService; // Import the ItemService. // This allows us to use the service layer to handle business logic related to items.
import org.springframework.beans.factory.annotation.Autowired; // Import the Autowired annotation. // This allows us to inject the ItemService into our controller class. // This is a Spring annotation that tells the framework to automatically inject the ItemService dependency when creating an instance of ItemController.
import org.springframework.web.bind.annotation.*; // Import Spring Web annotations. // This allows us to use annotations like @RestController, @RequestMapping, @GetMapping, @PostMapping, and @CrossOrigin to define our REST endpoints and handle HTTP requests.
import java.util.List;

@RestController // This annotation indicates that this class is a REST controller, which means
                // it will handle HTTP requests and return responses in a RESTful manner.
@RequestMapping("/api/items") // This annotation specifies the base URL for all endpoints in this controller.
                              // // This means that all endpoints in this controller will be prefixed with
                              // "/api/items".
@CrossOrigin(origins = "http://localhost:5173") // This annotation allows cross-origin requests from the specified
                                                // origin (the Vite frontend running on port 5173). // This is necessary
                                                // to enable communication between the frontend and backend when they
                                                // are running on different ports during development.
public class ItemController {

    @Autowired
    private ItemService itemService; // Inject the ItemService. // This allows us to use the service layer to handle
                                     // business logic related to items.

    // Endpoint to fetch all items
    @GetMapping
    public List<Item> getAllItems() {
        return itemService.getAllItems(); // This method will return a list of all items by calling the getAllItems()
                                          // method in the ItemService. // This will handle GET requests to "/api/items"
                                          // and return a list of Item objects in the response body.
    }

    // Endpoint to add a new item
    @PostMapping
    public Item addItem(@RequestBody Item item) {
        return itemService.addItem(item); // This method will save a new item by calling the addItem() method in the
                                          // ItemService. // This will handle POST requests to "/api/items" with an Item
                                          // object in the request body, save it to the database, and return the saved
                                          // Item object in the response body.
    }

    //
    @GetMapping("/test")
    public String testConnection() {
        return "MongoDB Connected Successfully";
    }
}
