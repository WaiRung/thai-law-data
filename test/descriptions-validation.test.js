// Validation test for the /api/descriptions folder structure
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

console.log('\n--- Descriptions Folder Structure Validation Tests ---\n');

// Test configurations
const configs = [
    {
        folder: 'api/descriptions/criminal_code',
        sourceFile: 'api/criminal_code.json',
        sourceKey: 'criminal_code',
        expectedCount: 44
    },
    {
        folder: 'api/descriptions/civil_and_commercial_code',
        sourceFile: 'api/civil_and_commercial_code.json',
        sourceKey: 'civil_and_commercial_code',
        expectedCount: 49
    },
    {
        folder: 'api/descriptions/civil_procedure_code',
        sourceFile: 'api/civil_procedure_code.json',
        sourceKey: 'civil_procedure_code',
        expectedCount: 36
    }
];

configs.forEach(config => {
    console.log(`Testing: ${config.folder}`);
    
    const folderPath = path.join(__dirname, '..', config.folder);
    const sourceFilePath = path.join(__dirname, '..', config.sourceFile);
    
    // Test 1: Folder exists
    const folderExists = fs.existsSync(folderPath);
    assert(folderExists, `  Folder exists: ${config.folder}`);
    
    if (!folderExists) {
        console.log('');
        return;
    }
    
    // Test 2: Folder contains JSON files
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
    assert(files.length > 0, `  Contains JSON files (${files.length} files)`);
    
    // Test 3: Count matches expected
    assert(files.length === config.expectedCount, 
        `  Has expected count: ${files.length} === ${config.expectedCount}`);
    
    // Test 4: Load source file and validate each section
    const sourceData = JSON.parse(fs.readFileSync(sourceFilePath, 'utf8'));
    const sourceSections = sourceData[config.sourceKey];
    
    // Test 5: Each JSON file is valid and contains proper structure
    let allFilesValid = true;
    let allContentValid = true;
    
    files.forEach((file, index) => {
        try {
            const filePath = path.join(folderPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            
            // Check required properties
            if (!data.id || !data.title || !data.content) {
                allFilesValid = false;
                console.error(`    ${file} missing required properties (id, title, content)`);
            }
            
            // Check content structure
            if (typeof data.content !== 'object' || !Array.isArray(data.content.paragraphs)) {
                allContentValid = false;
                console.error(`    ${file} content is not an object with paragraphs array`);
            }
        } catch (error) {
            allFilesValid = false;
            console.error(`    ${file} parse error: ${error.message}`);
        }
    });
    
    assert(allFilesValid, `  All JSON files are valid and have required properties`);
    assert(allContentValid, `  All JSON files have proper content structure`);
    
    // Test 6: Verify content matches source
    let contentMatches = true;
    sourceSections.forEach((section, index) => {
        // Find corresponding file
        const found = files.some(file => {
            const filePath = path.join(folderPath, file);
            const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return fileData.id === section.id && 
                   fileData.title === section.title &&
                   JSON.stringify(fileData.content) === JSON.stringify(section.content);
        });
        
        if (!found) {
            contentMatches = false;
            console.error(`    Section ${section.id} not found or content mismatch`);
        }
    });
    
    assert(contentMatches, `  All sections from source file match split files`);
    
    console.log('');
});

// Summary
setTimeout(() => {
    console.log('=================================');
    console.log('Descriptions Validation Test Summary:');
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    console.log('=================================\n');
    
    if (testsFailed > 0) {
        process.exit(1);
    }
}, 100);
