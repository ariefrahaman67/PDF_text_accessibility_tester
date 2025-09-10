// PDF.js worker config
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const progressContainer = document.getElementById('progressContainer');
const progressTitle = document.getElementById('progressTitle');
const progressBar = document.getElementById('progressBar');
const resultsSection = document.getElementById('resultsSection');
const uploadAgainBtn = document.getElementById('uploadAgainBtn');
const resultsTableContainer = document.getElementById('resultsTableContainer');
const legend = document.getElementById('legend');

let allResults = [];
let currentPage = 1;
const pageSize = 20;

// UI helpers
function showUploadBtn() {
    uploadBtn.style.display = 'inline-block';
    fileInput.value = '';
    progressContainer.style.display = 'none';
    resultsSection.style.display = 'none';
    resultsTableContainer.innerHTML = '';
    legend.style.display = 'none';
}
function showProgress(title, percent, color = '#4f8cff') {
    progressContainer.style.display = 'block';
    progressTitle.textContent = title;
    progressBar.style.width = percent + '%';
    progressBar.style.background = color;
}
function hideProgress() {
    progressContainer.style.display = 'none';
}
function showResults(results) {
    allResults = results;
    currentPage = 1;
    resultsSection.style.display = 'block';
    legend.style.display = 'flex';
    renderResultsTable();
}
function renderResultsTable() {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, allResults.length);
    let tableHtml = `<table class="results-table">
        <tr>
            <th>Preview</th>
            <th>File Name</th>
            <th>Accessibility</th>
        </tr>`;
    for(let i = startIdx; i < endIdx; i++) {
        const res = allResults[i];
        let preview = res.previewDataUrl
            ? `<img src="${res.previewDataUrl}" class="pdf-preview" alt="PDF preview">`
            : `<img src="pdf_placeholder.svg" class="pdf-preview" alt="PDF preview">`;
        let lamp = res.accessible
            ? `<img src="lamp_green.svg" class="lamp-icon" alt="Accessible">`
            : `<img src="lamp_red.svg" class="lamp-icon" alt="Not accessible">`;
        tableHtml += `<tr>
            <td>${preview}</td>
            <td>${res.filename}</td>
            <td>${lamp}</td>
        </tr>`;
    }
    tableHtml += `</table>`;

    // Pagination
    if (allResults.length > pageSize) {
        let pages = Math.ceil(allResults.length / pageSize);
        tableHtml += `<div class="pagination">
            <button class="pagination-btn" id="prevPageBtn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span>Page ${currentPage} of ${pages}</span>
            <button class="pagination-btn" id="nextPageBtn" ${currentPage === pages ? 'disabled' : ''}>Next</button>
        </div>`;
    }
    resultsTableContainer.innerHTML = tableHtml;
    if (allResults.length > pageSize) {
        document.getElementById('prevPageBtn').onclick = () => { if(currentPage > 1){currentPage--; renderResultsTable();} };
        document.getElementById('nextPageBtn').onclick = () => { let pages = Math.ceil(allResults.length / pageSize); if(currentPage < pages){currentPage++; renderResultsTable();} };
    }
}

// PDF analysis
async function analyzePDF(file, idx, total) {
    // Load PDF.js
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    let doc;
    try {
        doc = await loadingTask.promise;
    } catch (e) {
        return { filename: file.name, accessible: false, previewDataUrl: "", error: true };
    }
    // Thumbnail of first page (scale 1)
    let previewDataUrl = "";
    try {
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        previewDataUrl = canvas.toDataURL("image/png");
    } catch (e) {
        previewDataUrl = "";
    }
    // Accessibility analysis
    let hasText = false;
    let isReadable = false;
    try {
        for (let i = 1; i <= doc.numPages && !hasText; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const items = textContent.items;
            if (items.length > 0) {
                hasText = true;
                // Join text
                let text = items.map(item => item.str).join(' ').replace(/\s+/g, ' ').trim();
                // If text is long enough and readable
                if (text.length > 20) {
                    // Check for regular characters
                    let normalChars = text.replace(/[^a-zA-Z0-9À-ÿ\s.,;:'"-]/g, "");
                    let ratio = normalChars.length / text.length;
                    isReadable = ratio > 0.7;
                }
            }
        }
    } catch (e) {
        hasText = false;
        isReadable = false;
    }
    // Accessible if has selectable and readable text
    let accessible = hasText && isReadable;
    return { filename: file.name, accessible, previewDataUrl };
}

uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = async function() {
    const files = Array.from(fileInput.files);
    if (files.length === 0) return;

    // Only PDF extension allowed
    if (!files.every(f => f.name.toLowerCase().endsWith('.pdf'))) {
        alert('Only PDF files are accepted!');
        showUploadBtn();
        return;
    }
    uploadBtn.style.display = 'none';
    showProgress('Uploading files...', 0, '#4f8cff');

    let results = [];
    for (let i = 0; i < files.length; i++) {
        showProgress(`Analyzing documents... (${i+1}/${files.length})`, Math.round(((i)/files.length)*100), '#34d49c');
        let res = await analyzePDF(files[i], i+1, files.length);
        results.push(res);
        showProgress(`Analyzing documents... (${i+1}/${files.length})`, Math.round(((i+1)/files.length)*100), '#34d49c');
    }
    hideProgress();
    showResults(results);
};

uploadAgainBtn.onclick = showUploadBtn;

showUploadBtn();