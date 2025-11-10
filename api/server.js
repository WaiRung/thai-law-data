// Development server for serving static files locally
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME types for static files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Serve config endpoint
    if (parsedUrl.pathname === '/config/categories.json') {
        const configPath = path.join(__dirname, '..', 'config', 'categories.json');
        
        fs.readFile(configPath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to load categories config' }));
            } else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
        return;
    }
    
    // Serve static files
    let filePath = parsedUrl.pathname;
    
    // Default to index.html
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    // Build the full file path
    const rootDir = path.join(__dirname, '..');
    const fullPath = path.join(rootDir, filePath);
    
    // Security: Prevent directory traversal attacks
    const normalizedPath = path.normalize(fullPath);
    if (!normalizedPath.startsWith(rootDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 - Forbidden');
        return;
    }
    
    // Read and serve the file
    fs.readFile(normalizedPath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - File Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
            }
        } else {
            // Determine content type
            const ext = path.extname(normalizedPath);
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            // Set CORS headers for JSON files
            if (ext === '.json') {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Thai Law Data server running at http://localhost:${PORT}/`);
    console.log(`\nDirect JSON file access:`);
    console.log(`  http://localhost:${PORT}/api/civil_and_commercial_code.json`);
    console.log(`  http://localhost:${PORT}/api/civil_procedure_code.json`);
    console.log(`  http://localhost:${PORT}/api/criminal_code.json`);
});
