package com.cases.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cases.dto.CreateExpenseCategoryDto;
import com.cases.dto.CreateExpenseDto;
import com.cases.dto.ExpenseCategoryWithExpensesDto;
import com.cases.model.Expense;
import com.cases.model.ExpenseCategory;
import com.cases.repository.ExpenseRepository;
import com.cases.service.ExpenseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService service;
    private final ExpenseRepository expenseRepository;

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody CreateExpenseDto dto) {
        return ResponseEntity.ok(service.createExpense(dto));
    }

    @PostMapping("/categories")
    public ResponseEntity<ExpenseCategory> createCategory(@RequestBody CreateExpenseCategoryDto dto) {
        return ResponseEntity.ok(service.createCategory(dto));
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(@PathVariable String id) {
        return ResponseEntity.ok(service.getExpensesByCategory(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ExpenseCategory>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @GetMapping("/total")
    public ResponseEntity<?> getTotalExpenses(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<Expense> expenses;

            if (startDate != null && endDate != null) {
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate).plusDays(1);

                expenses = expenseRepository.findByDateBetween(start, end);
            } else {
                expenses = expenseRepository.findAll();
            }

            double totalExpenses = expenses.stream()
                    .mapToDouble(Expense::getAmount)
                    .sum();

            return ResponseEntity.ok(Map.of(
                    "totalExpenses", totalExpenses,
                    "count", expenses.size()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculating total expenses: " + e.getMessage());
        }
    }

    @GetMapping("/categories/filter")
    public ResponseEntity<List<ExpenseCategoryWithExpensesDto>> getCategoriesWithFilteredExpenses(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(service.getCategoriesWithFilteredExpenses(startDate, endDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        service.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

}
