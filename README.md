# Brain Waves — Website

A 6-page site: `index.html` (Home), `about.html`, `services.html`, `brainy.html`, `team.html`, `contact.html`.
Shared styling lives in `css/styles.css`, shared behavior in `js/main.js`, and mascot/logo images in `assets/`.

## Running it

Just open `index.html` in a browser — everything is plain HTML/CSS/JS, no build step, no server required.

To put it online, upload the whole folder (keeping the file structure) to any static host: GitHub Pages, Netlify, Vercel, or your own web server.

## Connecting the contact form to Google Sheets

The contact form on `contact.html` is wired up to send submissions to a Google Sheet, but it needs to be pointed at *your* Sheet first. This takes about 5 minutes and doesn't require any coding beyond copy-pasting one file.

1. **Create a Google Sheet.** Add a header row with exactly:
   `Timestamp | Name | Email | Message | Page`

2. **Open the script editor.** In the Sheet, go to `Extensions > Apps Script`.

3. **Paste the script.** Delete the placeholder code Google gives you, and paste in the contents of `google-apps-script.gs` (included in this folder).

4. **Deploy it as a web app.**
   - Click `Deploy > New deployment`.
   - Type: **Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click `Deploy`, then approve the permissions prompt (it's your own script acting on your own Sheet).

5. **Copy the Web App URL** — it ends in `/exec`.

6. **Paste it into the site.** Open `js/main.js`, find this line near the bottom:
   ```js
   const SHEET_WEBAPP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
   Replace the placeholder text with the URL you copied, keeping the quotes.

7. **Test it.** Open `contact.html`, submit the form, and check that a new row appears in your Sheet.

Until step 6 is done, submitting the form will show a friendly message telling the visitor (well, you, while testing) that the form isn't connected yet — it won't fail silently.

### If you ever need to redeploy

If you edit `google-apps-script.gs` later, you'll need to create a **new deployment** (or "Manage deployments" → edit the existing one) for changes to go live, and the Web App URL can change — update `js/main.js` again if it does.

## Editing content

Because this is plain multi-page HTML (no templating engine), the navigation and footer are repeated at the top/bottom of each page. If you want to change a nav link or footer detail, you'll need to update it in all six `.html` files — or ask Claude to regenerate them from `build.py`, which holds the shared nav/footer as single functions.

## Notes

- Team member display names were derived from the LinkedIn handles provided (e.g. `veerakumara` → "Veera Kumara"). Replace them in `team.html` (and `about.html`/`contact.html` if referenced) with real names if these guesses aren't right.
- "Startup TN Recognised" reflects the original brief; only the MSME/Udyam registration was verifiable from the uploaded certificate.
- The contact form uses a `no-cors` fetch to reach the Apps Script endpoint, which means the site can't read Google's response — it shows a success message optimistically once the request completes without a network error.
