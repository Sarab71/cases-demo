package com.cases.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "bills")
public class Bill {

    @Id
    private String id;

    private int invoiceNumber;

    @DBRef
    private Customer customer; // Reference to Customer document

    private LocalDate date; // Default to current date

    private List<BillItem> items; // Embedded list of bill items

    private int totalQty;

    private double grandTotal;

    private LocalDate dueDate;
}
