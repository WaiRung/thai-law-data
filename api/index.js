// API Handler for Thai Law Data
// Supports filtering, searching, and sorting via URL parameters

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        // Parse query parameters
        const { 
            code = 'civil_and_commercial_code',
            filter_id,
            filter_title,
            filter_content,
            search,
            sort = 'id',
            order = 'asc',
            limit,
            offset = '0'
        } = req.query;

        // Validate code type
        const validCodes = ['civil_and_commercial_code', 'civil_procedure_code', 'criminal_code'];
        if (!validCodes.includes(code)) {
            return res.status(400).json({
                error: `Invalid code type. Valid types: ${validCodes.join(', ')}`,
                code: code
            });
        }

        // Read the JSON file
        const filePath = path.join(__dirname, `${code}.json`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        let items = data[code];

        if (!items || !Array.isArray(items)) {
            return res.status(500).json({
                error: 'Invalid data format in JSON file',
                code: code
            });
        }

        // Helper function to search within nested content structure
        function searchInContent(content, searchText) {
            if (typeof content === 'object' && content.paragraphs) {
                for (const paragraph of content.paragraphs) {
                    if (paragraph.content.toLowerCase().includes(searchText)) {
                        return true;
                    }
                    if (paragraph.subsections && Array.isArray(paragraph.subsections)) {
                        for (const subsection of paragraph.subsections) {
                            if (subsection.content.toLowerCase().includes(searchText)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
            // Fallback for old format (string content)
            return String(content).toLowerCase().includes(searchText);
        }

        // Apply filters
        if (filter_id) {
            items = items.filter(item => {
                // Support both full format "มาตรา 1012" and just the number "1012"
                return item.id == filter_id || 
                       item.id === `มาตรา ${filter_id}` ||
                       String(item.id).includes(filter_id);
            });
        }
        if (filter_title) {
            const titleLower = filter_title.toLowerCase();
            items = items.filter(item => 
                item.title && item.title.toLowerCase().includes(titleLower)
            );
        }
        if (filter_content) {
            const contentLower = filter_content.toLowerCase();
            items = items.filter(item => 
                item.content && searchInContent(item.content, contentLower)
            );
        }

        // Apply search (searches across all text fields)
        if (search) {
            const searchLower = search.toLowerCase();
            items = items.filter(item => {
                const titleMatch = item.title && item.title.toLowerCase().includes(searchLower);
                const contentMatch = item.content && searchInContent(item.content, searchLower);
                const idMatch = item.id && item.id.toString().includes(searchLower);
                return titleMatch || contentMatch || idMatch;
            });
        }

        // Apply sorting
        if (sort && items.length > 0) {
            items.sort((a, b) => {
                let aVal = a[sort];
                let bVal = b[sort];

                // Handle undefined values
                if (aVal === undefined) return 1;
                if (bVal === undefined) return -1;

                // Compare based on type
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return order === 'asc' ? aVal - bVal : bVal - aVal;
                } else {
                    // Convert to string for comparison
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();

                    if (order === 'asc') {
                        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                    } else {
                        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                    }
                }
            });
        }

        // Apply pagination
        const total = items.length;
        const offsetNum = parseInt(offset) || 0;
        const limitNum = limit ? parseInt(limit) : null;
        
        if (limitNum !== null) {
            items = items.slice(offsetNum, offsetNum + limitNum);
        }

        // Build response
        const result = {
            code: code,
            total: total,
            offset: offsetNum,
            limit: limitNum,
            count: items.length,
            data: items
        };

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');

        // Return JSON response
        res.status(200).json(result);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: error.message,
            code: req.query.code || 'unknown'
        });
    }
};
