package com.cases.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cases.model.ExpenseCategory;

public interface ExpenseCategoryRepository extends MongoRepository<ExpenseCategory, String> {
    Optional<ExpenseCategory> findByName(String name);
}
