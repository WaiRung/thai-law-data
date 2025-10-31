# Thai Law Data

A repository providing Thai law data as raw JSON files for direct access. This is not an API - it simply serves static JSON files that you can fetch and process client-side.

## Features

- ✅ **Raw JSON files** - no API endpoints or query parameters
- ✅ **CORS enabled** for cross-origin requests
- ✅ **Pure static files** - no server required
- ✅ **Client-side processing** - fetch the data and filter/search/sort as needed

## Available Law Codes

- `civil_and_commercial_code` - Civil and Commercial Code (ประมวลกฎหมายแพ่งและพาณิชย์)
- `civil_procedure_code` - Civil Procedure Code (ประมวลกฎหมายวิธีพิจารณาความแพ่ง)
- `criminal_code` - Criminal Code (ประมวลกฎหมายอาญา)

## How to Access the JSON Files

Fetch the raw JSON files directly via HTTP:

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

This project supports deployment to multiple platforms with CORS enabled. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Quick Start:**

### GitHub Pages (Recommended)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

**Setup:**
1. Go to your repository Settings > Pages
2. Under "Build and deployment", select "Source: GitHub Actions"
3. Push your changes to the `main` branch
4. The site will be automatically deployed to `https://yourusername.github.io/repository-name/`

**CORS Support:** GitHub Pages automatically serves all public assets with `Access-Control-Allow-Origin: *`, enabling cross-origin requests from any domain.

### Vercel

This project can be deployed on Vercel as a static site with custom CORS headers:

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel
```

The `vercel.json` configuration file includes CORS headers for all JSON files in the `/api/` directory.

### Netlify

Deploy to Netlify with custom CORS headers:

1. Connect your repository to Netlify
2. The `netlify.toml` configuration file will automatically apply CORS headers to JSON files

### Other Static Hosts

All files are static HTML, CSS, JavaScript, and JSON. You can host them on any static hosting service.

## CORS Support

### Built-in CORS

All supported deployment platforms (GitHub Pages, Vercel, Netlify) serve the JSON files with CORS headers:

- **GitHub Pages**: Automatically adds `Access-Control-Allow-Origin: *` to all public files
- **Vercel**: Uses `vercel.json` configuration to add CORS headers
- **Netlify**: Uses `netlify.toml` configuration to add CORS headers

This allows you to fetch the JSON data from any origin:

```javascript
// This works from any domain
fetch('https://wairung.github.io/thai-law-data/api/civil_and_commercial_code.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Troubleshooting CORS

If you encounter CORS errors:

1. **Check deployment method**: Ensure your site is deployed using GitHub Actions (for GitHub Pages) or proper deployment methods for other platforms
2. **Verify URL**: Make sure you're accessing the correct production URL
3. **Local development**: Use `npm run dev` which includes CORS headers in the development server
4. **Mixed content**: Ensure you're not mixing HTTP and HTTPS requests

## Project Structure

```
thai-law-data/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions deployment
├── api/
│   ├── server.js                      # Development server with CORS
│   ├── civil_and_commercial_code.json
│   ├── civil_procedure_code.json
│   └── criminal_code.json
├── css/
│   └── style.css
├── js/
│   └── script.js
├── test/
│   ├── json-validation.test.js        # JSON validation tests
│   └── client-side-usage.test.js      # Client-side usage tests
├── .nojekyll                          # Disable Jekyll processing
├── _headers                           # Netlify headers configuration
├── netlify.toml                       # Netlify configuration
├── vercel.json                        # Vercel configuration with CORS
├── index.html                         # Web interface
├── api-example.html                   # Usage examples
├── package.json
├── DEPLOYMENT.md                      # Deployment guide
└── README.md                          # This file
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
