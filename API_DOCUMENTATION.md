# Thai Law Data - Direct JSON Access

This repository provides Thai law data as simple JSON files for direct access.

## Available JSON Files

Access the raw JSON files directly via HTTP:

- `/api/civil_and_commercial_code.json` - Civil and Commercial Code (ประมวลกฎหมายแพ่งและพาณิชย์)
- `/api/civil_procedure_code.json` - Civil Procedure Code (ประมวลกฎหมายวิธีพิจารณาความแพ่ง)
- `/api/criminal_code.json` - Criminal Code (ประมวลกฎหมายอาญา)

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
            "content": "อันว่าสัญญาจัดตั้งห้างหุ้นส่วนหรือบริษัทนั้น คือสัญญาซึ่งบุคคลตั้งแต่สองคนขึ้นไปตกลงเข้ากันเพื่อกระทำกิจการร่วมกัน ด้วยประสงค์จะแบ่งปันกำไรอันจะพึงได้แต่กิจการที่ทำนั้น",
            "subsections": null
          }
        ]
      }
    }
  ]
}
```

## Usage Examples

### Example 1: Fetch all data

```javascript
fetch('api/civil_and_commercial_code.json')
  .then(response => response.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    console.log(`Total items: ${items.length}`);
    console.log(items);
  });
```

### Example 2: Filter by ID

```javascript
fetch('api/civil_and_commercial_code.json')
  .then(response => response.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    const filtered = items.filter(item => 
      item.id === 'มาตรา 1012' || item.id.includes('1012')
    );
    console.log(filtered);
  });
```

### Example 3: Search in title

```javascript
fetch('api/civil_and_commercial_code.json')
  .then(response => response.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    const searchTerm = 'สัญญา';
    const results = items.filter(item => 
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(results);
  });
```

### Example 4: Search in content (nested structure)

```javascript
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
  return String(content).toLowerCase().includes(searchText);
}

fetch('api/civil_and_commercial_code.json')
  .then(response => response.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    const searchTerm = 'ห้างหุ้นส่วน';
    const results = items.filter(item => 
      searchInContent(item.content, searchTerm.toLowerCase())
    );
    console.log(results);
  });
```

### Example 5: Sort by ID

```javascript
fetch('api/civil_and_commercial_code.json')
  .then(response => response.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    // Sort ascending
    items.sort((a, b) => 
      String(a.id).localeCompare(String(b.id))
    );
    console.log(items);
  });
```

### Example 6: Pagination

```javascript
fetch('api/civil_and_commercial_code.json')
  .then(response => response.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    const limit = 10;
    const offset = 0;
    const page = items.slice(offset, offset + limit);
    console.log({
      total: items.length,
      offset: offset,
      limit: limit,
      count: page.length,
      data: page
    });
  });
```

### Example 7: Complex query (filter + sort + paginate)

```javascript
fetch('api/civil_and_commercial_code.json')
  .then(response => response.json())
  .then(data => {
    const items = data.civil_and_commercial_code;
    const searchTerm = 'สัญญา';
    
    // Filter
    let results = items.filter(item =>
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort
    results.sort((a, b) => 
      String(a.id).localeCompare(String(b.id))
    );
    
    // Paginate
    const limit = 5;
    const offset = 0;
    const page = results.slice(offset, offset + limit);
    
    console.log({
      total: results.length,
      offset: offset,
      limit: limit,
      count: page.length,
      data: page
    });
  });
```

## Live Examples

For interactive examples, see [api-example.html](api-example.html).

## CORS Support

All JSON files are served with CORS headers enabled, allowing cross-origin requests from any domain.

## Notes

- All filtering, searching, sorting, and pagination should be done client-side
- The JSON files are static and don't change during runtime
- For case-insensitive searches, use `.toLowerCase()` on both search term and target text
- The `content` field may have a nested structure with `paragraphs` and `subsections`
