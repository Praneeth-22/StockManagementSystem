package com.stockmanagement.BackendService.service;

import com.stockmanagement.BackendService.model.Order;
import com.stockmanagement.BackendService.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    // Update an existing order
    public Order updateOrder(String id, Order orderDetails) {
        return orderRepository.findById(id).map(existingOrder -> {
            // Update fields (add more if needed)
            existingOrder.setDate(orderDetails.getDate());
            existingOrder.setItems(orderDetails.getItems());
            existingOrder.setTotalItems(orderDetails.getTotalItems());
            existingOrder.setStatus(orderDetails.getStatus());
            existingOrder.setRemark(orderDetails.getRemark());
            return orderRepository.save(existingOrder);
            
        }).orElse(null); // Return null if ID not found
    }
    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}