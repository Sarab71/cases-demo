package com.cases.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CreateExpenseDto {
    private String description;
    private double amount;
    private LocalDate date;
    private String categoryId;
}
