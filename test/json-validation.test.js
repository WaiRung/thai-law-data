// JSON validation test for all Thai Law Data files
const fs = require('fs');
const path = require('path');

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

// Test JSON files
const jsonFiles = [
    'api/civil_and_commercial_code.json',
    'api/criminal_code.json',
    'api/civil_procedure_code.json'
];

console.log('\n--- JSON Validation Tests ---\n');

jsonFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    console.log(`Testing: ${filePath}`);
    
    try {
        // Test 1: File exists
        const fileExists = fs.existsSync(fullPath);
        assert(fileExists, `  File exists: ${filePath}`);
        
        if (fileExists) {
            // Test 2: File is valid JSON
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            let data;
            try {
                data = JSON.parse(fileContent);
                assert(true, `  Valid JSON: ${filePath}`);
            } catch (parseError) {
                assert(false, `  Valid JSON: ${filePath} - ${parseError.message}`);
                return;
            }
            
            // Test 3: Contains expected root key
            const expectedKey = path.basename(filePath, '.json');
            assert(data[expectedKey] !== undefined, `  Contains '${expectedKey}' key`);
            
            // Test 4: Root value is an array
            assert(Array.isArray(data[expectedKey]), `  '${expectedKey}' is an array`);
            
            // Test 5: Array is not empty
            assert(data[expectedKey].length > 0, `  Array has items (${data[expectedKey].length})`);
            
            // Test 6: Each item has required properties
            let allItemsValid = true;
            data[expectedKey].forEach((item, index) => {
                if (!item.id || !item.title || !item.content) {
                    allItemsValid = false;
                    console.error(`    Item ${index} missing required properties`);
                }
            });
            assert(allItemsValid, `  All items have required properties (id, title, content)`);
        }
    } catch (error) {
        assert(false, `  Error processing ${filePath}: ${error.message}`);
    }
    
    console.log('');
});

// Summary
setTimeout(() => {
    console.log('=================================');
    console.log('JSON Validation Test Summary:');
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    console.log('=================================\n');
    
    if (testsFailed > 0) {
        process.exit(1);
    }
}, 100);
