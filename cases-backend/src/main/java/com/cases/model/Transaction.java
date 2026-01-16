package com.cases.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "transaction")
public class Transaction {

    @Id
    private String id;

    @DBRef
    private Customer customer;

    private String type; // should be either "debit" or "credit"

    private double amount;

    private LocalDate date;

    private String description;

    @DBRef
    private Bill relatedBill;  // ✅ Keep as reference to Bill object

    private Integer invoiceNumber;
}
