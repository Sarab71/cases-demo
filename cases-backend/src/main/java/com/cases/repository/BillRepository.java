package com.cases.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cases.model.Bill;

public interface BillRepository extends MongoRepository<Bill, String> {
    Optional<Bill> findTopByOrderByInvoiceNumberDesc(); // for auto-increment
    List<Bill> findByDueDate(LocalDate dueDate);
    List<Bill> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
