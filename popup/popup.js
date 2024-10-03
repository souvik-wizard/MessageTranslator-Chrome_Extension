const fetchLang = async () => {
  try {
    console.log("Fetching languages...");
    const response = await fetch(
      "https://microsoft-translator-text-api3.p.rapidapi.com/languages",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "b772aa655cmshd6b3aab9ad7d7e0p10a524jsn57a88a590afb",
          "x-rapidapi-host": "microsoft-translator-text-api3.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched languages:", data);
    let languages = data.translation;
    return languages;
  } catch (error) {
    console.error("Failed to fetch languages:", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // Check if current tab is WhatsApp Web
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentTab = tabs[0];
    const langs = document.querySelector("#languages");
    const messageBox = document.getElementById("messageBox");
    const saveBtn = document.getElementById("saveBtn");
    const languageSection = document.getElementById("languageSection");

    if (currentTab.url.includes("https://web.whatsapp.com")) {
      // If on WhatsApp Web, show the dropdown and button, hide the message
      saveBtn.style.display = "block";
      languageSection.style.display = "block";
      messageBox.style.display = "none";

      langs.innerHTML = "<option>Loading...</option>";
      const languages = await fetchLang();

      if (languages) {
        let langCodes = Object.keys(languages);
        let langNames = Object.values(languages).map((lang) => lang.name);
        langs.innerHTML = "";

        for (let i = 0; i < langCodes.length; i++) {
          langs.innerHTML += `<option value="${langCodes[i]}">${langNames[i]}</option>`;
        }
      }
    } else {
      // If not on WhatsApp Web, hide the dropdown and button, show the message
      saveBtn.style.display = "none";
      messageBox.style.display = "block";
      languageSection.style.display = "none";
      messageBox.innerText = `Please open "web.whatsapp.com" to use the translator.`;
    }
  });
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const lang = document.getElementById("languages").value;
  console.log("Selected language:", lang);
  chrome.storage.sync.set({ preferredLang: lang }, () => {
    console.log("Language saved:", lang);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "setLanguage",
        lang: lang,
      });
    });
  });
});
