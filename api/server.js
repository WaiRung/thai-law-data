// Development server for testing the API locally
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const apiHandler = require('./index.js');

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
    
    // Handle API requests
    if (parsedUrl.pathname === '/api' || parsedUrl.pathname === '/api/') {
        // Create a mock request/response object compatible with the handler
        const mockReq = {
            query: parsedUrl.query,
            method: req.method,
            url: req.url
        };
        
        const mockRes = {
            statusCode: 200,
            headers: {},
            setHeader: function(key, value) {
                this.headers[key] = value;
            },
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                Object.keys(this.headers).forEach(key => {
                    res.setHeader(key, this.headers[key]);
                });
                res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data, null, 2));
            }
        };
        
        apiHandler(mockReq, mockRes);
    } else {
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
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Thai Law Data API server running at http://localhost:${PORT}/`);
    console.log(`\nExample requests:`);
    console.log(`  http://localhost:${PORT}/api?code=civil_and_commercial_code`);
    console.log(`  http://localhost:${PORT}/api?code=civil_and_commercial_code&search=สัญญา`);
    console.log(`  http://localhost:${PORT}/api?code=civil_and_commercial_code&filter_id=1012`);
    console.log(`  http://localhost:${PORT}/api?code=civil_and_commercial_code&sort=id&order=desc`);
    console.log(`  http://localhost:${PORT}/api?code=civil_and_commercial_code&limit=1&offset=0`);
});
