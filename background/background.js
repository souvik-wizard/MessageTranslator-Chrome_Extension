console.log("Background script running...");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    const { text, targetLang } = request;
    fetch(
      `https://microsoft-translator-text-api3.p.rapidapi.com/translate?to=${targetLang}&from=en&textType=plain`,
      {
        method: "POST",
        headers: {
          "x-rapidapi-key":
            "b772aa655cmshd6b3aab9ad7d7e0p10a524jsn57a88a590afb",
          "x-rapidapi-host": "microsoft-translator-text-api3.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ Text: text }]),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        sendResponse({ translatedText: data[0].translations[0].text });
      })
      .catch((err) => console.error("Translation Error:", err));
    return true; // Keep the message channel open for sendResponse
  }
});

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("web.whatsapp.com")) {
    chrome.pageAction.show(tabId);

    chrome.tabs.sendMessage(tabId, { action: "showIcon" });
  }
});
