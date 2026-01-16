package com.cases.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.cases.dto.CreateExpenseCategoryDto;
import com.cases.dto.CreateExpenseDto;
import com.cases.dto.ExpenseCategoryWithExpensesDto;
import com.cases.model.Expense;
import com.cases.model.ExpenseCategory;
import com.cases.repository.ExpenseCategoryRepository;
import com.cases.repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseCategoryRepository categoryRepo;
    private final ExpenseRepository expenseRepo;

    public ExpenseCategory createCategory(CreateExpenseCategoryDto dto) {
        if (categoryRepo.findByName(dto.getName()).isPresent()) {
            throw new IllegalArgumentException("Category already exists");
        }
        ExpenseCategory category = ExpenseCategory.builder()
                .name(dto.getName())
                .build();
        return categoryRepo.save(category);
    }

    public Expense createExpense(CreateExpenseDto dto) {
        if (!categoryRepo.existsById(dto.getCategoryId())) {
            throw new IllegalArgumentException("Invalid category ID");
        }

        Expense expense = Expense.builder()
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .categoryId(dto.getCategoryId())
                .build();

        return expenseRepo.save(expense);
    }

    public List<ExpenseCategory> getAllCategories() {
        return categoryRepo.findAll();
    }

    public List<Expense> getExpensesByCategory(String categoryId) {
        return expenseRepo.findByCategoryId(categoryId);
    }

    public double getTotalBetweenDates(LocalDate start, LocalDate end) {
        return expenseRepo.findByDateBetween(start, end)
                .stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    public List<ExpenseCategoryWithExpensesDto> getCategoriesWithFilteredExpenses(String startDateStr,
            String endDateStr) {
        List<ExpenseCategory> categories = categoryRepo.findAll();
        List<ExpenseCategoryWithExpensesDto> result = new ArrayList<>();

        LocalDate startDate = null;
        LocalDate endDate = null;

        if (startDateStr != null && endDateStr != null) {
            startDate = LocalDate.parse(startDateStr);
            endDate = LocalDate.parse(endDateStr).plusDays(1); // to make it inclusive
        }

        for (ExpenseCategory category : categories) {
            List<Expense> expenses;

            if (startDate != null && endDate != null) {
                expenses = expenseRepo.findByCategoryIdAndDateBetween(category.getId(), startDate, endDate);
            } else {
                expenses = expenseRepo.findByCategoryId(category.getId());
            }

            result.add(new ExpenseCategoryWithExpensesDto(
                    category.getId(),
                    category.getName(),
                    expenses));
        }

        return result;
    }

    public void deleteExpense(String id) {
        if (!expenseRepo.existsById(id)) {
            throw new IllegalArgumentException("Expense not found");
        }
        expenseRepo.deleteById(id);
    }

    public void deleteCategory(String id) {
        if (!categoryRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }

        // Delete all expenses under this category
        List<Expense> expenses = expenseRepo.findByCategoryId(id);
        expenseRepo.deleteAll(expenses);

        categoryRepo.deleteById(id);
    }

}
