# Thai Law Data API Documentation

This API provides access to Thai law data with support for filtering, searching, and sorting via URL parameters.

## Base URL

```
https://[your-domain]/api/handler.html
```

## Endpoints

### Get Law Data

**URL:** `/api/handler.html`

**Method:** `GET`

**Description:** Retrieve Thai law data with optional filtering, searching, and sorting.

## Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `code` | string | The type of law code to query. Options: `civil_and_commercial_code`, `civil_procedure_code`, `criminal_code` | `code=civil_and_commercial_code` |
| `filter_id` | number | Filter results by exact ID match | `filter_id=1012` |
| `filter_title` | string | Filter results by title (case-insensitive partial match) | `filter_title=สัญญา` |
| `filter_content` | string | Filter results by content (case-insensitive partial match) | `filter_content=ห้างหุ้นส่วน` |
| `search` | string | Search across all fields (id, title, content) | `search=บริษัท` |
| `sort` | string | Field to sort by. Options: `id`, `title`, `content` | `sort=id` |
| `order` | string | Sort order. Options: `asc`, `desc` | `order=desc` |
| `limit` | number | Maximum number of results to return | `limit=10` |
| `offset` | number | Number of results to skip (for pagination) | `offset=0` |

## Response Format

### Success Response

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

**Response Fields:**
- `code`: The law code type that was queried
- `total`: Total number of results matching the filters (before pagination)
- `offset`: The offset value used
- `limit`: The limit value used (null if no limit)
- `count`: Number of results returned in this response
- `data`: Array of law data objects

### Error Response

```json
{
  "error": "Invalid code type: invalid_code",
  "code": "invalid_code"
}
```

## Usage Examples

### Example 1: Get all items from civil and commercial code
```
/api/handler.html?code=civil_and_commercial_code
```

### Example 2: Filter by ID
```
/api/handler.html?code=civil_and_commercial_code&filter_id=1012
```

### Example 3: Search for a term
```
/api/handler.html?code=civil_and_commercial_code&search=บริษัท
```

### Example 4: Filter by title containing text
```
/api/handler.html?code=civil_and_commercial_code&filter_title=สัญญา
```

### Example 5: Sort by ID in descending order
```
/api/handler.html?code=civil_and_commercial_code&sort=id&order=desc
```

### Example 6: Pagination - Get 10 items starting from offset 20
```
/api/handler.html?code=civil_and_commercial_code&limit=10&offset=20
```

### Example 7: Complex query - Search, sort, and paginate
```
/api/handler.html?code=civil_and_commercial_code&search=ห้างหุ้นส่วน&sort=id&order=asc&limit=5&offset=0
```

### Example 8: Multiple filters
```
/api/handler.html?code=civil_and_commercial_code&filter_title=สัญญา&filter_content=ห้างหุ้นส่วน
```

## Available Law Codes

- `civil_and_commercial_code` - Civil and Commercial Code
- `civil_procedure_code` - Civil Procedure Code
- `criminal_code` - Criminal Code

## Data Structure

### Basic Format

Most law data items have a simple structure with three fields:

```json
{
  "id": 1,
  "title": "การฟ้องคดี",
  "content": "ผู้ใดจะฟ้องคดีแพ่งต่อศาลได้..."
}
```

### Structured Content Format

Some law items contain structured content with paragraphs and subsections. For these items, an additional `sections` field is provided to make the content easier to parse programmatically:

```json
{
  "id": 3,
  "title": "มูลคดีเกิดขึ้นในเรือ หรือจำเลยไม่มีภูมิลำเนาอยู่ในราชอาณาจักร",
  "content": "เพื่อประโยชน์ในการเสนอคำฟ้อง...",
  "sections": {
    "introduction": "เพื่อประโยชน์ในการเสนอคำฟ้อง",
    "paragraphs": [
      {
        "number": "1",
        "content": "ในกรณีที่มูลคดีเกิดขึ้นในเรือไทย..."
      },
      {
        "number": "2",
        "content": "ในกรณีที่จำเลยไม่มีภูมิลำเนาอยู่ในราชอาณาจักร",
        "subsections": [
          {
            "number": "ก",
            "content": "ถ้าจำเลยเคยมีภูมิลำเนาอยู่..."
          },
          {
            "number": "ข",
            "content": "ถ้าจำเลยประกอบหรือเคยประกอบกิจการ..."
          }
        ]
      }
    ]
  }
}
```

**Note:** The `content` field is always present for backward compatibility and contains the full text. The `sections` field is optional and provides a structured representation when available.

## Notes

1. All text searches and filters are case-insensitive
2. The `search` parameter searches across all fields (id, title, content)
3. Multiple filters can be combined (they are applied with AND logic)
4. If both `search` and specific filters are provided, all conditions must be met
5. Default sort order is ascending by ID if not specified
6. If no `limit` is specified, all matching results are returned

## Direct JSON Access

For direct access to raw JSON files without filtering:
- `/api/civil_and_commercial_code.json`
- `/api/civil_procedure_code.json`
- `/api/criminal_code.json`

## Rate Limiting

As this is a static site, there are no server-side rate limits. However, please be considerate with your requests.

## Error Codes

- Invalid code type: Returned when the specified `code` parameter doesn't match any available law codes
- HTTP 404: Returned when the requested JSON file doesn't exist
- HTTP 500: Returned for unexpected server errors
