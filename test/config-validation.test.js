// Test for categories configuration
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

console.log('\n--- Categories Config Tests ---\n');

// Test 1: Config file exists
const configPath = path.join(__dirname, '..', 'config', 'categories.json');
const configExists = fs.existsSync(configPath);
assert(configExists, 'Config file exists: config/categories.json');

if (configExists) {
    // Test 2: Config is valid JSON
    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configContent);
        assert(true, 'Config is valid JSON');
        
        // Test 3: Config is an object
        assert(typeof config === 'object' && !Array.isArray(config), 'Config is an object');
        
        // Test 4: Config has at least one category
        const categories = Object.keys(config);
        assert(categories.length > 0, `Config has categories (${categories.length})`);
        
        // Test 5: Each category maps to an array of data IDs
        let allCategoriesValid = true;
        categories.forEach(category => {
            if (!Array.isArray(config[category])) {
                allCategoriesValid = false;
                console.error(`  Category '${category}' does not map to an array`);
            }
            if (config[category].length === 0) {
                allCategoriesValid = false;
                console.error(`  Category '${category}' has no data IDs`);
            }
        });
        assert(allCategoriesValid, 'All categories map to non-empty arrays');
        
        // Test 6: Verify referenced JSON files exist
        let allDataFilesExist = true;
        categories.forEach(category => {
            const dataIds = config[category];
            dataIds.forEach(dataId => {
                const dataFilePath = path.join(__dirname, '..', 'api', `${dataId}.json`);
                if (!fs.existsSync(dataFilePath)) {
                    allDataFilesExist = false;
                    console.error(`  Data file not found: api/${dataId}.json (referenced by category '${category}')`);
                }
            });
        });
        assert(allDataFilesExist, 'All referenced data files exist');
        
        // Test 7: Each referenced data file is valid JSON
        let allDataFilesValid = true;
        categories.forEach(category => {
            const dataIds = config[category];
            dataIds.forEach(dataId => {
                const dataFilePath = path.join(__dirname, '..', 'api', `${dataId}.json`);
                if (fs.existsSync(dataFilePath)) {
                    try {
                        const dataContent = fs.readFileSync(dataFilePath, 'utf8');
                        JSON.parse(dataContent);
                    } catch (parseError) {
                        allDataFilesValid = false;
                        console.error(`  Invalid JSON in api/${dataId}.json: ${parseError.message}`);
                    }
                }
            });
        });
        assert(allDataFilesValid, 'All referenced data files are valid JSON');
        
    } catch (parseError) {
        assert(false, `Config is valid JSON - ${parseError.message}`);
    }
}

// Summary
console.log('\n=================================');
console.log('Categories Config Test Summary:');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);
console.log('=================================\n');

if (testsFailed > 0) {
    process.exit(1);
}
