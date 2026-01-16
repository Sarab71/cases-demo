package com.cases.dto;

import java.time.LocalDate;
import java.util.List;

import com.cases.model.BillItem;

import lombok.Data;

@Data
public class BillUpdateRequestDto {
    private String customerId;
    private Integer invoiceNumber;
    private List<BillItem> items;
    private int totalQty;
    private LocalDate date;
    private Double grandTotal;
    private LocalDate dueDate;
}
