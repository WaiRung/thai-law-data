# Thai Law Data

A simple repository for accessing Thai law data as JSON files.

## Features

- ✅ **Direct JSON access** - no API complexity
- ✅ **CORS enabled** for cross-origin requests
- ✅ **Pure static files** - no server required
- ✅ **Client-side filtering** - filter, search, sort on your own

## Available Law Codes

- `civil_and_commercial_code` - Civil and Commercial Code (ประมวลกฎหมายแพ่งและพาณิชย์)
- `civil_procedure_code` - Civil Procedure Code (ประมวลกฎหมายวิธีพิจารณาความแพ่ง)
- `criminal_code` - Criminal Code (ประมวลกฎหมายอาญา)

## Direct JSON Access

Access the raw JSON files directly:

For local development:
```
http://localhost:3000/api/civil_and_commercial_code.json
http://localhost:3000/api/civil_procedure_code.json
http://localhost:3000/api/criminal_code.json
```

For production:
```
https://wairung.github.io/thai-law-data/api/civil_and_commercial_code.json
https://wairung.github.io/thai-law-data/api/civil_procedure_code.json
https://wairung.github.io/thai-law-data/api/criminal_code.json
```

## Data Format

Each JSON file contains an object with a key matching the law code type, containing an array of law items:

```json
{
  "civil_and_commercial_code": [
    {
      "id": "มาตรา 1012",
      "title": "สัญญาจัดตั้งห้างหุ้นส่วนหรือบริษัท",
      "content": {
        "paragraphs": [
          {
            "id": 1,
            "content": "อันว่าสัญญาจัดตั้งห้างหุ้นส่วนหรือบริษัทนั้น...",
            "subsections": null
          }
        ]
      }
    }
  ]
}
```

## Usage Examples

### Fetch all data
```javascript
fetch('api/civil_and_commercial_code.json')
  .then(res => res.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    console.log(items);
  });
```

### Filter by ID
```javascript
fetch('api/civil_and_commercial_code.json')
  .then(res => res.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    const filtered = items.filter(item => item.id === 'มาตรา 1012');
    console.log(filtered);
  });
```

### Search in title
```javascript
fetch('api/civil_and_commercial_code.json')
  .then(res => res.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    const results = items.filter(item => 
      item.title && item.title.includes('สัญญา')
    );
    console.log(results);
  });
```

See [api-example.html](api-example.html) for more interactive examples.

## Development

### Prerequisites

- Node.js 14.x or higher (for development server only)

### Setup

1. Clone the repository
```bash
git clone https://github.com/WaiRung/thai-law-data.git
cd thai-law-data
```

2. Start the development server (optional)
```bash
npm run dev
```

The server will be available at `http://localhost:3000/`

### Testing

Run the test suite:
```bash
npm test
```

## Deployment

### Vercel

This project can be deployed on Vercel as a static site:

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel
```

### GitHub Pages

All files are static and can be hosted on GitHub Pages or any static hosting service.

## Project Structure

```
thai-law-data/
├── api/
│   ├── server.js                     # Development server
│   ├── civil_and_commercial_code.json
│   ├── civil_procedure_code.json
│   └── criminal_code.json
├── css/
│   └── style.css
├── js/
│   └── script.js
├── test/
│   └── json-validation.test.js       # JSON validation tests
├── index.html                         # Web interface
├── api-example.html                   # Usage examples
├── package.json
└── README.md                          # This file
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
