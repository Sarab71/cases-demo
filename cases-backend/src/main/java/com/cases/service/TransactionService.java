package com.cases.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cases.model.Transaction;
import com.cases.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDate.now());
        }
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(String id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> getTransactionsForCustomer(String customerId) {
        return transactionRepository.findByCustomer_IdOrderByDateAsc(customerId); // ✅ fixed
    }

    public Optional<Transaction> getTransactionByRelatedBillId(String billId) {
        return transactionRepository.findByRelatedBill_Id(billId); // ✅ fixed
    }

    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }
}
