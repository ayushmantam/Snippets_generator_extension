function sanitizeCode(raw) {
  // Remove markdown code fences and optional language tag
  const cleaned = raw
    .replace(/```[a-zA-Z]*/g, "")  // remove ```cpp or similar
    .replace(/```/g, "")           // remove any remaining ```
    .trim();

  // Escape HTML special characters
  return cleaned
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

document.getElementById("generate-snippet").addEventListener("click", async () => {
  const resultDiv = document.getElementById("snippet-result");
  resultDiv.innerHTML = '<div class="loading"><div class="loader"></div></div>';
  const lang = document.getElementById("language-type").value;

  chrome.storage.sync.get(["geminiApiKey"], async (result) => {
    if (!result.geminiApiKey) {
      resultDiv.innerHTML = "API key not found. Please set your API key in the extension options.";
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, async (res) => {
        if (!res || !res.text) {
          resultDiv.innerText = "Could not extract problem text from this page.";
          return;
        }

        try {
          const snippet = await getGeminiSnippet(res.text, lang, result.geminiApiKey);
          const sanitized = sanitizeCode(snippet);
          resultDiv.innerHTML = `<pre><code>${sanitized}</code></pre>`;

        } catch (error) {
          resultDiv.innerText = `Error: ${error.message || "Failed to generate snippet."}`;
        }
      });
    });
  });
});

document.getElementById("copy-btn").addEventListener("click", () => {
  const snippetText = document.getElementById("snippet-result").innerText;
  if (snippetText && snippetText.trim() !== "") {
    navigator.clipboard.writeText(snippetText).then(() => {
      const copyBtn = document.getElementById("copy-btn");
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "Copied!";
      setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  }
});

async function getGeminiSnippet(text, lang, apiKey) {
  const maxLength = 20000;
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const languagePrompts = {
    cpp: `Generate a clean and structured C++ snippet for the following problem. Use standard C++ STL, correct variable declarations based on the input description. DO NOT SOLVE THE PROBLEM I MEAN DO NOT ADD ANY LOGIC. Only code:

${truncatedText}`,
    python: `Generate a clean and structured Python code snippet for the following problem. Include all necessary imports and clearly define input/output structures.DO NOT SOLVE THE PROBLEM I MEAN DO NOT ADD ANY LOGIC. Only code:

${truncatedText}`,
    java: `Generate a clean and structured Java code snippet for the following problem. Include all necessary classes and input/output declarations.DO NOT SOLVE THE PROBLEM I MEAN DO NOT ADD ANY LOGIC. Only code:

${truncatedText}`
  };

  const prompt = languagePrompts[lang] || languagePrompts["cpp"];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 10
        }
      })
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || "API request failed");
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No snippet generated.";
}
