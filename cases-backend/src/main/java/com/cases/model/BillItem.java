package com.cases.model;

import lombok.Data;

@Data
public class BillItem {
    private String modelNumber;
    private int quantity;
    private double rate;
    private Double discount;     // Optional
    private double totalAmount;
}