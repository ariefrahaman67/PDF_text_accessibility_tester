# PDF Accessibility Checker

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6b90593f124e4b8a94e63cd32a61b93b)](https://app.codacy.com/gh/R0mb0/PDF_text_accessibility_tester/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/PDF_text_accessibility_tester)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/PDF_text_accessibility_tester)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)

[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)

A modern, client-side web tool for checking the accessibility of PDF documents in batch. Upload one or more PDF files and instantly see if their text is selectable and readable — all directly in your browser, with no server upload required. Results are shown with document previews, clear status indicators, and easy navigation.

<div align="center">

[![example](https://github.com/R0mb0/PDF_text_accessibility_tester/blob/main/ReadMe_Imgs/example.png)](https://github.com/R0mb0/PDF_text_accessibility_tester)

</div>

---

## Features

- **Batch upload PDF files:** Select one or more PDFs from your computer. Only `.pdf` files are accepted.
- **Client-side analysis:** All processing happens in your browser; no files are uploaded or stored elsewhere.
- **Accessibility check:** The tool analyzes each PDF to verify if it contains selectable and readable text (not just images or corrupted content).
- **Visual previews:** See a thumbnail of the first page for each PDF, or a placeholder if no preview is available.
- **Clear results table:** Each document is marked as accessible (green lamp) or not accessible (red lamp), along with its file name and preview.

---

## What is "PDF Accessibility"?

In this tool, a PDF is considered **accessible** if:
- The document contains at least one page with selectable text (not just scanned images).
- The extracted text is readable (i.e., not corrupted or composed of random/garbled characters).

A PDF is **not accessible** if:
- It only contains scanned images (no selectable text).
- Its text is damaged or unreadable when copied/pasted.
- It is encrypted, protected, or fails to load.

---

## How To Use

1. **Open the application** in your browser (just open `index.html`).
2. Click the **"Upload documents"** button.
3. Select one or more PDF files from your computer (only PDF files are accepted).
4. Wait for the progress bar and analysis to finish.  
   - The tool will first show file upload progress, then analysis progress.
5. View results in the table:
   - Each row shows a preview, file name, and accessibility status (green/red lamp).
   - If you uploaded more than 20 PDFs, use the navigation buttons below the table.
6. Check the legend for icon meanings.
7. Click **"Upload more files"** to start a new session.

---

## Technology & Privacy

- **All processing is local:** No server, no cloud, no file storage.
- **Built with:** HTML, CSS, JavaScript, [PDF.js](https://mozilla.github.io/pdf.js/) for PDF parsing.

---

## Limitations

- Does not check for full WCAG/PDF-UA accessibility, only for selectable/readable text.
- Password-protected, encrypted, or DRM PDFs are marked as "not accessible".
- Analysis speed depends on your browser and computer.

