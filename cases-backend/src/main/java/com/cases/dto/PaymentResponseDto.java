package com.cases.dto;

import com.cases.model.Transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDto {
    private String message;
    private Transaction transaction;
    private double updatedBalance;
    private String customerId;
    private String customerName;
}
