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
        expectedCount: 56
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
    let sourceData, sourceSections;
    try {
        sourceData = JSON.parse(fs.readFileSync(sourceFilePath, 'utf8'));
        sourceSections = sourceData[config.sourceKey];
        
        if (!sourceSections) {
            console.error(`  Source file missing key: ${config.sourceKey}`);
            console.log('');
            return;
        }
    } catch (error) {
        console.error(`  Error reading source file: ${error.message}`);
        console.log('');
        return;
    }
    
    // Test 5: Each JSON file is valid and contains proper structure
    let allFilesValid = true;
    let allContentValid = true;
    const parsedFiles = {};
    
    files.forEach((file, index) => {
        try {
            const filePath = path.join(folderPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            
            // Cache parsed data for later use
            parsedFiles[file] = data;
            
            // Check required properties
            if (!data.id || !data.descriptions) {
                allFilesValid = false;
                console.error(`    ${file} missing required properties (id, descriptions)`);
            }
            
            // Check descriptions structure
            if (!Array.isArray(data.descriptions)) {
                allContentValid = false;
                console.error(`    ${file} descriptions is not an array`);
            } else if (data.descriptions.length === 0) {
                allContentValid = false;
                console.error(`    ${file} descriptions array is empty`);
            } else {
                // Check each description has content property
                data.descriptions.forEach((desc, descIndex) => {
                    if (!desc.hasOwnProperty('content')) {
                        allContentValid = false;
                        console.error(`    ${file} description ${descIndex} missing content property`);
                    }
                });
            }
        } catch (error) {
            allFilesValid = false;
            console.error(`    ${file} parse error: ${error.message}`);
        }
    });
    
    assert(allFilesValid, `  All JSON files are valid and have required properties`);
    assert(allContentValid, `  All JSON files have proper descriptions structure`);
    
    // Test 6: Verify all sections from source exist as files (using cached data)
    let allSectionsExist = true;
    sourceSections.forEach((section, index) => {
        // Find corresponding file using cached data
        const found = Object.values(parsedFiles).some(fileData => {
            return fileData.id === section.id;
        });
        
        if (!found) {
            allSectionsExist = false;
            console.error(`    Section ${section.id} file not found`);
        }
    });
    
    assert(allSectionsExist, `  All sections from source file exist as individual files`);
    
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
