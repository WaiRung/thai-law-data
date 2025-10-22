// Example usage of the structured content format
const fs = require('fs');
const path = require('path');

// Load civil_procedure_code.json
const filePath = path.join(__dirname, '..', 'api', 'civil_procedure_code.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Find item with ID 3
const item3 = data.civil_procedure_code.find(item => item.id === 3);

console.log('=== Example: Using Structured Content ===\n');

// Example 1: Display the introduction
console.log('Introduction:');
console.log(item3.sections.introduction);
console.log('');

// Example 2: Iterate through paragraphs
console.log('Paragraphs:');
item3.sections.paragraphs.forEach(paragraph => {
    console.log(`\n(${paragraph.number}) ${paragraph.content}`);
    
    // Check if paragraph has subsections
    if (paragraph.subsections) {
        paragraph.subsections.forEach(subsection => {
            console.log(`  (${subsection.number}) ${subsection.content}`);
        });
    }
});

console.log('\n');

// Example 3: Extract specific paragraph
console.log('=== Example: Extract Specific Paragraph ===\n');
const paragraph2 = item3.sections.paragraphs.find(p => p.number === '2');
console.log('Paragraph 2:', paragraph2.content);
console.log('Number of subsections:', paragraph2.subsections.length);

console.log('\n');

// Example 4: Search within subsections
console.log('=== Example: Find Subsection Containing Keyword ===\n');
const keyword = 'กิจการ';
let foundSubsection = null;
let foundInParagraph = null;

item3.sections.paragraphs.forEach(p => {
    if (p.subsections) {
        p.subsections.forEach(s => {
            if (s.content.includes(keyword)) {
                foundSubsection = s;
                foundInParagraph = p.number;
            }
        });
    }
});

if (foundSubsection) {
    console.log(`Found keyword "${keyword}" in:`);
    console.log(`Paragraph (${foundInParagraph}), Subsection (${foundSubsection.number})`);
    console.log(`Content: ${foundSubsection.content.substring(0, 100)}...`);
}

console.log('\n=== All Examples Completed Successfully ===\n');
