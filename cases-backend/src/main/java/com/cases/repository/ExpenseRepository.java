package com.cases.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.cases.model.Expense;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {

    List<Expense> findByCategoryId(String categoryId);

    List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Expense> findByCategoryIdAndDateBetween(String categoryId, LocalDate start, LocalDate end);

    @Query(value = "{ 'date': { $gte: ?0, $lte: ?1 } }", fields = "{ 'amount': 1 }")
    List<Expense> findAmountsByDateBetween(LocalDate start, LocalDate end);
}
