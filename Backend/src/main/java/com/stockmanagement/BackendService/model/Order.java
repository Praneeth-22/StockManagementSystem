package com.stockmanagement.BackendService.model;

import lombok.Data ; // Import Lombok's Data annotation to generate getters, setters, toString, equals, and hashCode methods.
import lombok.NoArgsConstructor ; // Import Lombok's NoArgsConstructor annotation to generate a no-argument constructor.
import lombok.AllArgsConstructor ; // Import Lombok's AllArgsConstructor annotation to generate a constructor with all arguments.
import org.springframework.data.annotation.Id; // Import Spring Data's Id annotation to mark the primary key field.
import org.springframework.data.mongodb.core.aggregation.ArrayOperators.In;
import org.springframework.data.mongodb.core.mapping.Document; // Import Spring Data MongoDB's Document annotation to specify the collection name in MongoDB.
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders") // This annotation tells Spring Data MongoDB that this class represents a document in the "orders" collection in MongoDB.
public class Order {
    @Id
    private String id;
    private String date;
    private Integer totalItems;
    private List<Map<String, Object>> items; // List of items in the order, where each item is represented as a map with keys like "name", "quantity", "price", etc.
    private String status; 

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    private String remark; 

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
