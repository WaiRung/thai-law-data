// Pagination state
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;
let allItems = [];
let currentCodeType = '';

async function filterById() {
    const id = document.getElementById('filterId').value;
    const codeType = document.getElementById('codeType').value;
    
    if (!id) {
        alert('Please enter an ID');
        return;
    }

    try {
        const response = await fetch(`api/${codeType}.json`);
        const data = await response.json();
        
        // Filter by ID
        const items = data[codeType];
        const filteredItem = items.find(item => item.id == id); // Use == for string/number comparison
        
        displayResults(filteredItem, codeType);
    } catch (error) {
        document.getElementById('results').innerHTML = 
            `<div class="result error">Error loading data: ${error.message}</div>`;
    }
}

async function getAllData() {
    const codeType = document.getElementById('codeType').value;
    
    try {
        const response = await fetch(`api/${codeType}.json`);
        const data = await response.json();
        displayResults(data[codeType], codeType, true);
    } catch (error) {
        document.getElementById('results').innerHTML = 
            `<div class="result error">Error loading data: ${error.message}</div>`;
    }
}

function escapeHtml(text) {
    // Escape HTML to prevent XSS
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatContentText(text) {
    // Convert newlines and tabs to HTML
    return escapeHtml(text)
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // Convert tabs to 4 spaces
        .replace(/\n/g, '<br>'); // Convert newlines to <br>
}

function formatContent(content) {
    // Handle both old string format and new object format
    if (typeof content === 'string') {
        return formatContentText(content);
    }
    
    // New format with paragraphs
    if (content && content.paragraphs && Array.isArray(content.paragraphs)) {
        let html = '';
        content.paragraphs.forEach(paragraph => {
            html += `<div class="paragraph">`;
            html += `<div class="paragraph-content">${formatContentText(paragraph.content)}</div>`;
            
            // Add subsections if they exist
            if (paragraph.subsections && paragraph.subsections.length > 0) {
                html += `<div class="subsections">`;
                paragraph.subsections.forEach(subsection => {
                    html += `<div class="subsection">`;
                    html += `<span class="subsection-id">(${subsection.id})</span> `;
                    html += `<span class="subsection-content">${formatContentText(subsection.content)}</span>`;
                    html += `</div>`;
                });
                html += `</div>`;
            }
            
            html += `</div>`;
        });
        return html;
    }
    
    // Fallback for any other format
    return formatContentText(String(content));
}

function displayResults(data, codeType, showAll = false) {
    const resultsDiv = document.getElementById('results');
    
    if (showAll) {
        allItems = data;
        currentCodeType = codeType;
        currentPage = 1;
        renderPaginatedResults();
    } else {
        // Single item result - no pagination needed
        hidePagination();
        if (data) {
            resultsDiv.innerHTML = `
                <h3>Found in ${codeType.replace(/_/g, ' ')}:</h3>
                <div class="result">
                    <strong>ID ${data.id}: ${data.title}</strong>
                    <div class="content">${formatContent(data.content)}</div>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `<div class="result">No item found with ID ${document.getElementById('filterId').value}</div>`;
        }
    }
}

function searchInContent(content, searchText) {
    if (!content) return false;
    
    // Handle string content
    if (typeof content === 'string') {
        return content.toLowerCase().includes(searchText);
    }
    
    // Handle object content with paragraphs
    if (content.paragraphs && Array.isArray(content.paragraphs)) {
        return content.paragraphs.some(paragraph => {
            // Check paragraph content
            if (paragraph.content && paragraph.content.toLowerCase().includes(searchText)) {
                return true;
            }
            // Check subsections
            if (paragraph.subsections && Array.isArray(paragraph.subsections)) {
                return paragraph.subsections.some(subsection => 
                    subsection.content && subsection.content.toLowerCase().includes(searchText)
                );
            }
            return false;
        });
    }
    
    return false;
}

async function advancedFilter() {
    const codeType = document.getElementById('codeType').value;
    const filterId = document.getElementById('filterId').value;
    const filterTitle = document.getElementById('filterTitle').value.toLowerCase();
    const filterContent = document.getElementById('filterContent').value.toLowerCase();
    
    try {
        const response = await fetch(`api/${codeType}.json`);
        const data = await response.json();
        const items = data[codeType];
        
        const filteredItems = items.filter(item => {
            return (!filterId || item.id == filterId) &&
                   (!filterTitle || item.title.toLowerCase().includes(filterTitle)) &&
                   (!filterContent || searchInContent(item.content, filterContent));
        });
        
        displayAdvancedResults(filteredItems, codeType);
    } catch (error) {
        document.getElementById('results').innerHTML = 
            `<div class="result error">Error: ${error.message}</div>`;
    }
}

function displayAdvancedResults(items, codeType) {
    const resultsDiv = document.getElementById('results');
    
    if (items.length > 0) {
        allItems = items;
        currentCodeType = codeType;
        currentPage = 1;
        renderPaginatedResults();
    } else {
        hidePagination();
        resultsDiv.innerHTML = `<div class="result">No items found matching your criteria</div>`;
    }
}

function renderPaginatedResults() {
    const resultsDiv = document.getElementById('results');
    
    // Calculate pagination
    const pageSizeValue = document.getElementById('pageSize').value;
    pageSize = pageSizeValue === 'all' ? allItems.length : parseInt(pageSizeValue);
    totalPages = Math.ceil(allItems.length / pageSize);
    
    // Ensure current page is valid
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, allItems.length);
    const itemsToShow = allItems.slice(startIndex, endIndex);
    
    // Display results
    resultsDiv.innerHTML = `<h3>Found ${allItems.length} items in ${currentCodeType.replace(/_/g, ' ')} (Showing ${startIndex + 1}-${endIndex}):</h3>`;
    itemsToShow.forEach(item => {
        resultsDiv.innerHTML += `
            <div class="result">
                <strong>ID ${item.id}: ${item.title}</strong>
                <div class="content">${formatContent(item.content)}</div>
            </div>
        `;
    });
    
    // Update pagination controls
    updatePaginationControls();
}

function updatePaginationControls() {
    const pageInfo = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('pageInfo').textContent = pageInfo;
    document.getElementById('pageInfoBottom').textContent = pageInfo;
    
    // Update button states
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    
    document.getElementById('firstBtn').disabled = isFirstPage;
    document.getElementById('prevBtn').disabled = isFirstPage;
    document.getElementById('nextBtn').disabled = isLastPage;
    document.getElementById('lastBtn').disabled = isLastPage;
    
    document.getElementById('firstBtnBottom').disabled = isFirstPage;
    document.getElementById('prevBtnBottom').disabled = isFirstPage;
    document.getElementById('nextBtnBottom').disabled = isLastPage;
    document.getElementById('lastBtnBottom').disabled = isLastPage;
    
    // Show pagination controls
    document.getElementById('paginationTop').style.display = 'block';
    document.getElementById('paginationBottom').style.display = 'block';
}

function hidePagination() {
    document.getElementById('paginationTop').style.display = 'none';
    document.getElementById('paginationBottom').style.display = 'none';
}

function goToPage(page) {
    currentPage = page;
    renderPaginatedResults();
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderPaginatedResults();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPaginatedResults();
    }
}

function changePageSize() {
    currentPage = 1;
    renderPaginatedResults();
}
