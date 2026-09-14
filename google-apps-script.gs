/**
 * Brain Waves — Contact Form to Google Sheet
 * -------------------------------------------
 * 1. Open (or create) a Google Sheet for your submissions.
 * 2. In row 1, add these headers exactly:
 *      Timestamp | Name | Email | Message | Page
 * 3. Go to Extensions > Apps Script in that Sheet.
 * 4. Delete the placeholder code and paste this whole file in.
 * 5. Click "Deploy" > "New deployment".
 *      - Select type: "Web app"
 *      - Description: anything (e.g. "Contact form")
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Click "Deploy", then "Authorize access" and allow it
 *    (it's your own script, acting on your own Sheet).
 * 7. Copy the "Web app URL" (it ends in /exec).
 * 8. Paste that URL into js/main.js as SHEET_WEBAPP_URL.
 *
 * Whenever someone submits the contact form on the site,
 * a new row is appended to this Sheet automatically.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.message || '',
      data.page || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you sanity-check the deployment by opening
// the Web App URL directly in a browser (GET request).
function doGet(e) {
  return ContentService
    .createTextOutput('Brain Waves contact endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
