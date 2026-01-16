package com.cases.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cases.model.Transaction;

public interface TransactionRepository extends MongoRepository<Transaction, String> {

    // ✅ fetch transactions by customer._id and sort by date
    List<Transaction> findByCustomer_IdOrderByDateAsc(String customerId);

    // ✅ fetch transaction where relatedBill._id == billId
    Optional<Transaction> findByRelatedBill_Id(String billId);

    List<Transaction> findByType(String type);

    List<Transaction> findByTypeAndDateBetween(String type, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByCustomer_IdAndDateBetweenOrderByDateAsc(String customerId, LocalDate startDate,
            LocalDate endDate);

}
