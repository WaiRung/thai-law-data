# Thai Law Data API

A simple API for accessing Thai law data with support for filtering, searching, and sorting via URL parameters.

## Features

- ✅ **Filter** by ID, title, or content
- ✅ **Search** across all fields
- ✅ **Sort** by any field (ascending or descending)
- ✅ **Paginate** results with limit and offset
- ✅ **CORS enabled** for cross-origin requests
- ✅ **Pure JavaScript** - no database required

## Available Law Codes

- `civil_and_commercial_code` - Civil and Commercial Code (ประมวลกฎหมายแพ่งและพาณิชย์)
- `civil_procedure_code` - Civil Procedure Code (ประมวลกฎหมายวิธีพิจารณาความแพ่ง)
- `criminal_code` - Criminal Code (ประมวลกฎหมายอาญา)

## API Usage

### Base URL

For local development:
```
http://localhost:3000/api
```

For production (GitHub Pages):
```
https://wairung.github.io/thai-law-data/api/handler.html
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `code` | string | Law code type | `code=civil_and_commercial_code` |
| `filter_id` | number | Filter by exact ID | `filter_id=1012` |
| `filter_title` | string | Filter by title (partial match) | `filter_title=สัญญา` |
| `filter_content` | string | Filter by content (partial match) | `filter_content=ห้างหุ้นส่วน` |
| `search` | string | Search all fields | `search=บริษัท` |
| `sort` | string | Field to sort by | `sort=id` |
| `order` | string | Sort order (asc/desc) | `order=desc` |
| `limit` | number | Max results to return | `limit=10` |
| `offset` | number | Number of results to skip | `offset=0` |

### Examples

#### Get all data
```
GET /api/handler.html?code=civil_and_commercial_code
```

#### Filter by ID
```
GET /api/handler.html?code=civil_and_commercial_code&filter_id=1012
```

#### Search for a term
```
GET /api/handler.html?code=civil_and_commercial_code&search=สัญญา
```

#### Sort by ID descending
```
GET /api/handler.html?code=civil_and_commercial_code&sort=id&order=desc
```

#### Paginate results
```
GET /api/handler.html?code=civil_and_commercial_code&limit=10&offset=0
```

#### Complex query
```
GET /api/handler.html?code=civil_and_commercial_code&filter_title=สัญญา&sort=id&order=asc&limit=5
```

### Response Format

```json
{
  "code": "civil_and_commercial_code",
  "total": 100,
  "offset": 0,
  "limit": 10,
  "count": 10,
  "data": [
    {
      "id": 1012,
      "title": "สัญญาจัดตั้งห้างหุ้นส่วนหรือบริษัท",
      "content": "อันว่าสัญญาจัดตั้งห้างหุ้นส่วนหรือบริษัทนั้น..."
    }
  ]
}
```

## Development

### Prerequisites

- Node.js 14.x or higher

### Setup

1. Clone the repository
```bash
git clone https://github.com/WaiRung/thai-law-data.git
cd thai-law-data
```

2. Install dependencies (if any)
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

### Testing

Run the test suite:
```bash
npm test
```

## Deployment

### Vercel

This project is ready to deploy on Vercel:

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel
```

### GitHub Pages

The static files (HTML/CSS/JS) can be hosted on GitHub Pages, but the API endpoints require a serverless platform like Vercel, Netlify, or AWS Lambda.

## Direct JSON Access

For direct access to raw JSON files without filtering:
- `/api/civil_and_commercial_code.json`
- `/api/civil_procedure_code.json`
- `/api/criminal_code.json`

## Project Structure

```
thai-law-data/
├── api/
│   ├── index.js                      # API handler (serverless function)
│   ├── server.js                     # Development server
│   ├── handler.html                  # Client-side API handler
│   ├── civil_and_commercial_code.json
│   ├── civil_procedure_code.json
│   └── criminal_code.json
├── css/
│   └── style.css
├── js/
│   └── script.js
├── test/
│   └── api.test.js                   # API tests
├── index.html                         # Web interface
├── package.json
├── API_DOCUMENTATION.md              # Detailed API docs
└── README.md                          # This file
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
