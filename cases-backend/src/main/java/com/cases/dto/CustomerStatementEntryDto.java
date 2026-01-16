package com.cases.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerStatementEntryDto {
    private String type; // "debit" or "credit"
    private double amount;
    private LocalDate date;
    private String description;
    private Integer invoiceNumber;
    private String relatedBillId;
    private double runningBalance;
}
