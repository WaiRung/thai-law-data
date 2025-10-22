// Test for structured content format in civil_procedure_code.json
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

console.log('\n--- Structured Content Tests ---\n');

// Load civil_procedure_code.json
const filePath = path.join(__dirname, '..', 'api', 'civil_procedure_code.json');
const fileContent = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContent);

// Test ID 3 specifically
const item3 = data.civil_procedure_code.find(item => item.id === 3);

console.log('Testing ID 3 - Structured Content Format');

// Test 1: Item exists
assert(item3 !== undefined, 'ID 3 exists in civil_procedure_code');

if (item3) {
    // Test 2: Has required basic fields
    assert(item3.id === 3, 'ID is 3');
    assert(item3.title !== undefined, 'Has title field');
    assert(item3.content !== undefined, 'Has content field (backward compatibility)');
    
    // Test 3: Has sections structure
    assert(item3.sections !== undefined, 'Has sections field');
    
    if (item3.sections) {
        // Test 4: Has introduction
        assert(item3.sections.introduction !== undefined, 'Has introduction in sections');
        assert(typeof item3.sections.introduction === 'string', 'Introduction is a string');
        assert(item3.sections.introduction.length > 0, 'Introduction is not empty');
        
        // Test 5: Has paragraphs array
        assert(item3.sections.paragraphs !== undefined, 'Has paragraphs array');
        assert(Array.isArray(item3.sections.paragraphs), 'Paragraphs is an array');
        assert(item3.sections.paragraphs.length === 2, 'Has 2 paragraphs');
        
        // Test 6: Paragraph 1 structure
        const p1 = item3.sections.paragraphs[0];
        assert(p1.number === '1', 'Paragraph 1 has correct number');
        assert(p1.content !== undefined, 'Paragraph 1 has content');
        assert(typeof p1.content === 'string', 'Paragraph 1 content is a string');
        assert(p1.subsections === undefined, 'Paragraph 1 has no subsections');
        
        // Test 7: Paragraph 2 structure
        const p2 = item3.sections.paragraphs[1];
        assert(p2.number === '2', 'Paragraph 2 has correct number');
        assert(p2.content !== undefined, 'Paragraph 2 has content');
        assert(typeof p2.content === 'string', 'Paragraph 2 content is a string');
        assert(p2.subsections !== undefined, 'Paragraph 2 has subsections');
        
        // Test 8: Subsections structure
        if (p2.subsections) {
            assert(Array.isArray(p2.subsections), 'Subsections is an array');
            assert(p2.subsections.length === 2, 'Has 2 subsections');
            
            // Test 9: Subsection (ก)
            const s1 = p2.subsections[0];
            assert(s1.number === 'ก', 'Subsection 1 has correct number (ก)');
            assert(s1.content !== undefined, 'Subsection 1 has content');
            assert(typeof s1.content === 'string', 'Subsection 1 content is a string');
            
            // Test 10: Subsection (ข)
            const s2 = p2.subsections[1];
            assert(s2.number === 'ข', 'Subsection 2 has correct number (ข)');
            assert(s2.content !== undefined, 'Subsection 2 has content');
            assert(typeof s2.content === 'string', 'Subsection 2 content is a string');
        }
    }
    
    // Test 11: Backward compatibility - content field should still contain full text
    assert(item3.content.includes('เพื่อประโยชน์ในการเสนอคำฟ้อง'), 'Content field contains introduction');
    assert(item3.content.includes('(1)'), 'Content field contains paragraph (1)');
    assert(item3.content.includes('(2)'), 'Content field contains paragraph (2)');
    assert(item3.content.includes('(ก)'), 'Content field contains subsection (ก)');
    assert(item3.content.includes('(ข)'), 'Content field contains subsection (ข)');
}

// Summary
setTimeout(() => {
    console.log('\n=================================');
    console.log('Structured Content Test Summary:');
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    console.log('=================================\n');
    
    if (testsFailed > 0) {
        process.exit(1);
    }
}, 100);
