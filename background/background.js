console.log("Background script running...");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    const { text, targetLang } = request;
    //Detect Language
    fetch(
      "https://microsoft-translator-text-api3.p.rapidapi.com/detectlanguage",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": "YOUR_API_KEY",
          "x-rapidapi-host": "microsoft-translator-text-api3.p.rapidapi.com",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify([{ Text: text }]),
      }
    )
      .then((response) => response.json())
      .then((detectionData) => {
        const detectedLang = detectionData[0].language;
        console.log(detectedLang, "detectedLang");

        //Perform Translation
        fetch(
          `https://microsoft-translator-text-api3.p.rapidapi.com/translate?to=${targetLang}&from=${detectedLang}&textType=plain`,
          {
            method: "POST",
            headers: {
              "x-rapidapi-key": "YOUR_API_KEY",
              "x-rapidapi-host":
                "microsoft-translator-text-api3.p.rapidapi.com",
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
      })
      .catch((err) => console.error("Detection Error:", err));

    return true; // Keep the message channel open for sendResponse
  }
});

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("web.whatsapp.com")) {
    chrome.pageAction.show(tabId);

    chrome.tabs.sendMessage(tabId, { action: "showIcon" });
  }
});
