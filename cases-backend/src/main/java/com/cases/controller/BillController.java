package com.cases.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cases.dto.BillRequestDto;
import com.cases.dto.BillResponseDto;
import com.cases.dto.BillUpdateRequestDto;
import com.cases.model.BillItem;
import com.cases.repository.BillRepository;
import com.cases.service.BillService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;
    private final BillRepository billRepository;

    @PostMapping
    public BillResponseDto createBill(@RequestBody BillRequestDto request) {
        return billService.createBill(request);
    }

    @GetMapping
    public ResponseEntity<List<BillResponseDto>> getAllBills(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<BillResponseDto> bills = billService.getAllBills(startDate, endDate);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{id}")
    public BillResponseDto getBillById(@PathVariable String id) {
        return billService.getBillById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bill not found"));
    }

    @GetMapping("/by-due-date")
    public ResponseEntity<List<BillResponseDto>> getBillsByDueDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate) {

        List<BillResponseDto> bills = billService.getBillsByDueDate(dueDate);
        return ResponseEntity.ok(bills);
    }

    @Data
    public static class BillRequest {
        private List<BillItem> items;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBill(@PathVariable String id) {
        Map<String, Object> response = billService.deleteBill(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateBill(@PathVariable String id, @RequestBody BillUpdateRequestDto request) {
        return ResponseEntity.ok(billService.updateBill(id, request));
    }

    @GetMapping("/next-invoice-number")
    public ResponseEntity<Integer> getNextInvoiceNumber() {
        int nextInvoiceNumber = billRepository.findTopByOrderByInvoiceNumberDesc()
                .map(b -> b.getInvoiceNumber() + 1)
                .orElse(1001);
        return ResponseEntity.ok(nextInvoiceNumber);
    }

}
