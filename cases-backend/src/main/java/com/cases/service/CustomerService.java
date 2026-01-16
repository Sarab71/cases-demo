package com.cases.service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.cases.dto.CustomerRequestDto;
import com.cases.dto.CustomerResponseDto;
import com.cases.model.Customer;
import com.cases.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerResponseDto createCustomer(CustomerRequestDto requestDto) {
        if (customerRepository.existsByName(requestDto.getName())) {
            throw new RuntimeException("Customer with name already exists!");
        }

        Customer customer = Customer.builder()
                .name(requestDto.getName())
                .phone(requestDto.getPhone())
                .address(requestDto.getAddress())
                .balance(0)
                .build();

        Customer savedCustomer = customerRepository.save(customer);
        return convertToResponseDto(savedCustomer);
    }

    public List<CustomerResponseDto> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public CustomerResponseDto getCustomerById(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
        return convertToResponseDto(customer);
    }

    public CustomerResponseDto updateCustomer(String id, CustomerRequestDto requestDto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

        customer.setName(requestDto.getName());
        customer.setPhone(requestDto.getPhone());
        customer.setAddress(requestDto.getAddress());

        Customer updatedCustomer = customerRepository.save(customer);
        return convertToResponseDto(updatedCustomer);
    }

    public void deleteCustomer(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
        customerRepository.delete(customer);
    }

    private CustomerResponseDto convertToResponseDto(Customer customer) {
        CustomerResponseDto responseDto = new CustomerResponseDto();
        BeanUtils.copyProperties(customer, responseDto);
        return responseDto;
    }

}
