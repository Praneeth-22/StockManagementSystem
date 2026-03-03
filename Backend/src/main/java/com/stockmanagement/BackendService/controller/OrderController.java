package com.stockmanagement.BackendService.controller;

import com.stockmanagement.BackendService.model.Order;
import com.stockmanagement.BackendService.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService; // Inject the Service

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }
@PutMapping("/{id}") // Maps to PUT http://localhost:8080/api/orders/12345
    public Order updateOrder(@PathVariable String id, @RequestBody Order order) {
        return orderService.updateOrder(id, order);
    }
    @DeleteMapping("/{id}") 
    public void deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id); // Call the Service
    }
}