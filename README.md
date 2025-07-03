
# Codeforces/Codechef Snippet Generator Extension 🚀

This Chrome Extension allows you to generate **code snippets** in C++, Python, and Java from Codeforces/Codechef problem pages using **Gemini AI**.

---

## 🔧 Features

- 🔍 Automatically extracts the problem text from the Codeforces/Codechef page.
- 🧠 Uses Gemini API to generate:
  - ✅ C++ Snippets
  - ✅ Python Snippets
  - ✅ Java Snippets
- 📋 One-click **copy to clipboard** button.
- 🌐 Works on any Codeforces/Codechef problem page.

---

## 🛠 Setup Instructions

1. **Clone or extract** this project.

2. Go to `chrome://extensions/` in your Chrome browser.

3. Enable **Developer Mode** (top right).

4. Click on **“Load unpacked”** and select this extracted folder.

5. Click on the extension icon and set your **Gemini API Key** (get it from [Google AI Studio](https://makersuite.google.com/app/apikey)).

---

## 📂 Files Included

- `popup.html` – User interface for selecting language and generating snippets.
- `popup.js` – Logic for calling Gemini API and rendering code.
- `content.js` – Extracts page content.
- `background.js` – Background service worker.
- `options.html`, `options.js` – Settings page for API Key.
- `manifest.json` – Chrome extension manifest.
- `README.md` – This file.

---

## 📌 Notes

- Snippets are extracted cleanly, and markdown formatting is removed.
- If you face "undefined variable" or incorrect code, double-check if the problem text includes full I/O description.
- This is a client-side tool, no data is stored externally.
- Please Refresh The Page if any error 

---

Made with 💻 by Ayushman.
