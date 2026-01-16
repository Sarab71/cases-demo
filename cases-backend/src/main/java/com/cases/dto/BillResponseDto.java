package com.cases.dto;

import java.time.LocalDate;
import java.util.List;

import com.cases.model.BillItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillResponseDto {
    private String id;
    private int invoiceNumber;
    private String customerId;
    private String customerName;
    private LocalDate date;
    private List<BillItem> items;
    private int totalQty;
    private double grandTotal;
    private LocalDate dueDate;

}
