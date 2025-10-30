// Test to verify client-side usage of JSON files
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

console.log('\n--- Client-Side Usage Tests ---\n');

// Test 1: Load and parse civil_and_commercial_code.json
console.log('Test 1: Load and filter by ID');
try {
    const filePath = path.join(__dirname, '..', 'api', 'civil_and_commercial_code.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const items = data.civil_and_commercial_code;
    
    // Filter by ID (client-side) - exact match
    const filtered = items.filter(item => 
        item.id === 'มาตรา 1012'
    );
    
    assert(filtered.length > 0, 'Found items when filtering by ID');
    assert(filtered[0].id === 'มาตรา 1012', 'Correct item found');
    assert(filtered[0].title, 'Item has title');
    assert(filtered[0].content, 'Item has content');
} catch (error) {
    assert(false, `Error in test 1: ${error.message}`);
}

// Test 2: Search in title
console.log('\nTest 2: Search in title');
try {
    const filePath = path.join(__dirname, '..', 'api', 'civil_and_commercial_code.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const items = data.civil_and_commercial_code;
    
    const searchTerm = 'สัญญา';
    const results = items.filter(item => 
        item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    assert(results.length > 0, 'Found items when searching in title');
    assert(results[0].title.includes(searchTerm), 'Search term found in title');
} catch (error) {
    assert(false, `Error in test 2: ${error.message}`);
}

// Test 3: Sort by ID
console.log('\nTest 3: Sort by ID');
try {
    const filePath = path.join(__dirname, '..', 'api', 'civil_and_commercial_code.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const items = data.civil_and_commercial_code;
    
    // Make a copy to avoid modifying original
    const sorted = [...items].sort((a, b) => 
        String(a.id).localeCompare(String(b.id))
    );
    
    assert(sorted.length === items.length, 'Sorted array has same length');
    assert(sorted.length > 1, 'Array has multiple items to sort');
    
    // Check if sorted (first item should be <= second item)
    if (sorted.length >= 2) {
        const firstId = String(sorted[0].id);
        const secondId = String(sorted[1].id);
        assert(firstId.localeCompare(secondId) <= 0, 'Items are sorted');
    }
} catch (error) {
    assert(false, `Error in test 3: ${error.message}`);
}

// Test 4: Pagination
console.log('\nTest 4: Pagination');
try {
    const filePath = path.join(__dirname, '..', 'api', 'civil_and_commercial_code.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const items = data.civil_and_commercial_code;
    
    const limit = 5;
    const offset = 0;
    const page = items.slice(offset, offset + limit);
    
    assert(page.length <= limit, 'Page has correct number of items');
    assert(page.length > 0, 'Page has items');
    
    const result = {
        total: items.length,
        offset: offset,
        limit: limit,
        count: page.length,
        data: page
    };
    
    assert(result.total === items.length, 'Total count is correct');
    assert(result.count === page.length, 'Count is correct');
} catch (error) {
    assert(false, `Error in test 4: ${error.message}`);
}

// Test 5: Search in nested content
console.log('\nTest 5: Search in nested content');
try {
    const filePath = path.join(__dirname, '..', 'api', 'civil_and_commercial_code.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const items = data.civil_and_commercial_code;
    
    function searchInContent(content, searchText) {
        if (typeof content === 'object' && content.paragraphs) {
            for (const paragraph of content.paragraphs) {
                if (paragraph.content && paragraph.content.toLowerCase().includes(searchText)) {
                    return true;
                }
                if (paragraph.subsections && Array.isArray(paragraph.subsections)) {
                    for (const subsection of paragraph.subsections) {
                        if (subsection.content && subsection.content.toLowerCase().includes(searchText)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        return String(content).toLowerCase().includes(searchText);
    }
    
    const searchTerm = 'ห้างหุ้นส่วน';
    const results = items.filter(item => 
        searchInContent(item.content, searchTerm.toLowerCase())
    );
    
    assert(results.length > 0, 'Found items when searching in content');
} catch (error) {
    assert(false, `Error in test 5: ${error.message}`);
}

// Test 6: All three JSON files can be loaded
console.log('\nTest 6: All JSON files can be loaded');
const jsonFiles = [
    'civil_and_commercial_code',
    'civil_procedure_code',
    'criminal_code'
];

jsonFiles.forEach(codeType => {
    try {
        const filePath = path.join(__dirname, '..', 'api', `${codeType}.json`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        const items = data[codeType];
        
        assert(Array.isArray(items), `${codeType} is an array`);
        assert(items.length > 0, `${codeType} has items`);
    } catch (error) {
        assert(false, `Error loading ${codeType}: ${error.message}`);
    }
});

// Summary
console.log('\n=================================');
console.log('Client-Side Usage Test Summary:');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);
console.log('=================================\n');

if (testsFailed > 0) {
    process.exit(1);
}
