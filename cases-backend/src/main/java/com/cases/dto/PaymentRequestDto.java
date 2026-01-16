package com.cases.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PaymentRequestDto {
    private String customerId;
    private double amount;
    private String description;
    private LocalDate date; 
}
