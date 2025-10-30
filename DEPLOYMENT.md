# Deployment Guide

This guide explains how to deploy Thai Law Data to various hosting platforms with CORS support.

## GitHub Pages (Recommended)

GitHub Pages automatically serves all public assets with `Access-Control-Allow-Origin: *`, making it ideal for this project.

### Setup Instructions

1. **Enable GitHub Actions for Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Pages**
   - Under "Build and deployment", set **Source** to `GitHub Actions`

2. **Push to main branch**
   - The included workflow file `.github/workflows/deploy.yml` will automatically trigger
   - Your site will be deployed to `https://yourusername.github.io/repository-name/`

3. **Verify deployment**
   - Check the **Actions** tab to see the deployment progress
   - Once complete, test the CORS headers:
   ```bash
   curl -I https://yourusername.github.io/repository-name/api/civil_and_commercial_code.json
   ```
   - You should see: `Access-Control-Allow-Origin: *`

### Workflow Configuration

The GitHub Actions workflow (`.github/workflows/deploy.yml`) does the following:
- Triggers on push to `main` branch
- Checks out the repository
- Configures GitHub Pages
- Uploads the site as an artifact
- Deploys to GitHub Pages

The `.nojekyll` file ensures that files starting with underscores are not ignored.

## Vercel

Vercel supports custom headers through `vercel.json` configuration.

### Setup Instructions

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure (already done)**
   - The `vercel.json` file is already configured with CORS headers for `/api/*.json` files

4. **Verify**
   ```bash
   curl -I https://your-project.vercel.app/api/civil_and_commercial_code.json
   ```

### Vercel Configuration

The `vercel.json` file includes:
```json
{
  "headers": [
    {
      "source": "/api/(.*).json",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" },
        { "key": "Content-Type", "value": "application/json" }
      ]
    }
  ]
}
```

## Netlify

Netlify supports custom headers through `netlify.toml` configuration.

### Setup Instructions

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Deploy with default settings

2. **Configure (already done)**
   - The `netlify.toml` file is already configured with CORS headers

3. **Verify**
   ```bash
   curl -I https://your-site.netlify.app/api/civil_and_commercial_code.json
   ```

### Netlify Configuration

The `netlify.toml` file includes:
```toml
[[headers]]
  for = "/api/*.json"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type"
    Content-Type = "application/json"
```

Alternatively, you can use the `_headers` file (also included) which Netlify also supports.

## Local Development

For local development with CORS support:

```bash
npm run dev
```

This starts the development server at `http://localhost:3000/` with CORS headers enabled for JSON files.

The server (`api/server.js`) automatically adds these headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Testing CORS

To test if CORS is working correctly:

### Using curl
```bash
curl -I https://your-domain.com/api/civil_and_commercial_code.json | grep -i access-control
```

You should see:
```
Access-Control-Allow-Origin: *
```

### Using JavaScript
```javascript
fetch('https://your-domain.com/api/civil_and_commercial_code.json')
  .then(response => {
    console.log('CORS Headers:', {
      origin: response.headers.get('Access-Control-Allow-Origin'),
      methods: response.headers.get('Access-Control-Allow-Methods')
    });
    return response.json();
  })
  .then(data => console.log('Data loaded successfully:', data))
  .catch(error => console.error('CORS error:', error));
```

### Using Browser DevTools
1. Open your browser's Developer Tools
2. Go to the Network tab
3. Load the JSON file
4. Check the Response Headers for `Access-Control-Allow-Origin: *`

## Troubleshooting

### CORS Error on GitHub Pages

If you see CORS errors on GitHub Pages:

1. **Check deployment method**
   - Ensure "Source" is set to "GitHub Actions" in Settings > Pages
   - Verify the workflow ran successfully in the Actions tab

2. **Verify URL**
   - Make sure you're using the correct GitHub Pages URL
   - Check that the file exists: `https://username.github.io/repo/api/file.json`

3. **Clear cache**
   - GitHub Pages may cache old responses
   - Try accessing with `?v=timestamp` query parameter
   - Hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R)

4. **Check file accessibility**
   - Verify the repository is public
   - Ensure `.nojekyll` file exists in the root

### Mixed Content Errors

If your site uses HTTPS but tries to load HTTP resources:
- Always use HTTPS URLs: `https://wairung.github.io/thai-law-data/api/...`
- Never use HTTP URLs from an HTTPS page

### Browser Extensions

Some browser extensions (ad blockers, privacy tools) may interfere with CORS:
- Test in an incognito/private window
- Temporarily disable extensions

## Platform Comparison

| Platform | CORS Support | Setup Difficulty | Custom Headers | Build Time |
|----------|-------------|------------------|----------------|------------|
| **GitHub Pages** | ✅ Automatic | Easy | No | Fast |
| **Vercel** | ✅ via config | Easy | Yes | Very Fast |
| **Netlify** | ✅ via config | Easy | Yes | Fast |
| **Other Static Hosts** | ⚠️ Varies | Varies | Varies | Varies |

### Recommendation

- **For public open data**: GitHub Pages (free, simple, automatic CORS)
- **For projects needing custom headers**: Vercel or Netlify
- **For high traffic**: Consider a CDN like Cloudflare

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages CORS Support](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests)
- [Vercel Headers Configuration](https://vercel.com/docs/project-configuration#project-configuration/headers)
- [Netlify Headers Configuration](https://docs.netlify.com/routing/headers/)
