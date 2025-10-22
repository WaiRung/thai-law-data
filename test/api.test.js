// Simple test suite for the Thai Law Data API
const fs = require('fs');
const path = require('path');

// Mock require for the API handler
const apiHandler = require('../api/index.js');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        console.log('✓ ' + message);
        testsPassed++;
    } else {
        console.error('✗ ' + message);
        testsFailed++;
    }
}

function createMockResponse() {
    let responseData = null;
    let statusCode = 200;
    
    return {
        status: function(code) {
            statusCode = code;
            return this;
        },
        json: function(data) {
            responseData = data;
        },
        setHeader: function() {},
        getResponse: function() {
            return { status: statusCode, data: responseData };
        }
    };
}

// Test 1: Basic query - get all data
console.log('\n--- Test 1: Get all civil and commercial code data ---');
(async () => {
    const mockReq = { query: { code: 'civil_and_commercial_code' } };
    const mockRes = createMockResponse();
    
    await apiHandler(mockReq, mockRes);
    const response = mockRes.getResponse();
    
    assert(response.status === 200, 'Status code is 200');
    assert(response.data.code === 'civil_and_commercial_code', 'Code type is correct');
    assert(response.data.total === 2, 'Total count is correct');
    assert(response.data.count === 2, 'Result count is correct');
    assert(Array.isArray(response.data.data), 'Data is an array');
})();

// Test 2: Filter by ID
console.log('\n--- Test 2: Filter by ID ---');
(async () => {
    const mockReq = { query: { code: 'civil_and_commercial_code', filter_id: '1012' } };
    const mockRes = createMockResponse();
    
    await apiHandler(mockReq, mockRes);
    const response = mockRes.getResponse();
    
    assert(response.status === 200, 'Status code is 200');
    assert(response.data.count === 1, 'Filtered to 1 result');
    assert(response.data.data[0].id === 1012, 'Correct ID returned');
})();

// Test 3: Search functionality
console.log('\n--- Test 3: Search across fields ---');
(async () => {
    const mockReq = { query: { code: 'civil_and_commercial_code', search: 'สัญญา' } };
    const mockRes = createMockResponse();
    
    await apiHandler(mockReq, mockRes);
    const response = mockRes.getResponse();
    
    assert(response.status === 200, 'Status code is 200');
    assert(response.data.count >= 1, 'Found at least 1 result');
})();

// Test 4: Filter by title
console.log('\n--- Test 4: Filter by title ---');
(async () => {
    const mockReq = { query: { code: 'civil_and_commercial_code', filter_title: 'ห้างหุ้นส่วน' } };
    const mockRes = createMockResponse();
    
    await apiHandler(mockReq, mockRes);
    const response = mockRes.getResponse();
    
    assert(response.status === 200, 'Status code is 200');
    assert(response.data.count >= 1, 'Found at least 1 result with matching title');
})();

// Test 5: Sorting
console.log('\n--- Test 5: Sort by ID descending ---');
(async () => {
    const mockReq = { query: { code: 'civil_and_commercial_code', sort: 'id', order: 'desc' } };
    const mockRes = createMockResponse();
    
    await apiHandler(mockReq, mockRes);
    const response = mockRes.getResponse();
    
    assert(response.status === 200, 'Status code is 200');
    if (response.data.data.length >= 2) {
        assert(response.data.data[0].id > response.data.data[1].id, 'Results are sorted descending');
    }
})();

// Test 6: Pagination with limit
console.log('\n--- Test 6: Pagination with limit ---');
(async () => {
    const mockReq = { query: { code: 'civil_and_commercial_code', limit: '1', offset: '0' } };
    const mockRes = createMockResponse();
    
    await apiHandler(mockReq, mockRes);
    const response = mockRes.getResponse();
    
    assert(response.status === 200, 'Status code is 200');
    assert(response.data.count === 1, 'Limited to 1 result');
    assert(response.data.limit === 1, 'Limit value is correct');
    assert(response.data.offset === 0, 'Offset value is correct');
})();

// Test 7: Invalid code type
console.log('\n--- Test 7: Invalid code type ---');
(async () => {
    const mockReq = { query: { code: 'invalid_code' } };
    const mockRes = createMockResponse();
    
    await apiHandler(mockReq, mockRes);
    const response = mockRes.getResponse();
    
    assert(response.status === 400, 'Status code is 400 for invalid code');
    assert(response.data.error !== undefined, 'Error message is present');
})();

// Test 8: Multiple filters combined
console.log('\n--- Test 8: Multiple filters combined ---');
(async () => {
    const mockReq = { 
        query: { 
            code: 'civil_and_commercial_code', 
            filter_title: 'สัญญา',
            sort: 'id',
            order: 'asc'
        } 
    };
    const mockRes = createMockResponse();
    
    await apiHandler(mockReq, mockRes);
    const response = mockRes.getResponse();
    
    assert(response.status === 200, 'Status code is 200');
    assert(response.data.total >= 0, 'Total count is present');
})();

// Summary
setTimeout(() => {
    console.log('\n=================================');
    console.log('Test Summary:');
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    console.log('=================================\n');
    
    if (testsFailed > 0) {
        process.exit(1);
    }
}, 1000);
