package com.cases.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cases.model.Transaction;
import com.cases.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final TransactionRepository transactionRepository;

    // ✅ GET Total Sales (All debit-type transactions)
    @GetMapping("/total")
    public ResponseEntity<?> getTotalSales(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        try {
            List<Transaction> debitTxns;

        if (startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate).plusDays(1);

            debitTxns = transactionRepository.findByTypeAndDateBetween("debit", start, end);
            } else {
                debitTxns = transactionRepository.findByType("debit");
            }

            double totalSales = debitTxns.stream()
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            return ResponseEntity.ok(Map.of(
                    "totalSales", totalSales,
                    "count", debitTxns.size()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculating total sales: " + e.getMessage());
        }
    }
}
