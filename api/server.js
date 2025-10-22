// Development server for testing the API locally
const http = require('http');
const url = require('url');
const apiHandler = require('./index.js');

const PORT = process.env.PORT || 3000;

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
        // Serve static files or 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n\nTry: http://localhost:' + PORT + '/api?code=civil_and_commercial_code');
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
