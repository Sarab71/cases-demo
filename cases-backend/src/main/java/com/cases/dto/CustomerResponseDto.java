package com.cases.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CustomerResponseDto {
    private String id;
    private String name;
    private String phone;
    private String address;
    private double balance;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
