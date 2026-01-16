package com.cases.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "expenses") 
public class Expense {
    @Id
    private String id;

    private String description;
    private double amount;
    private LocalDate date;

    private String categoryId;
}
