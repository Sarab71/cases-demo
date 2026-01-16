package com.cases.dto;

import com.cases.model.Expense;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExpenseCategoryWithExpensesDto {
    private String id;
    private String name;
    private List<Expense> expenses;
}
