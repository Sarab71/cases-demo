package com.cases.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatementTransactionDTO {
    private String id;
    private LocalDate date;
    private String particulars;
    private Integer debit;
    private Integer credit;
    private Integer balance;
    private Integer invoiceNumber;
    private String relatedBillId;
    private String type;
    private BigDecimal amount;
    private String description;
}
