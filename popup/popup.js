const fetchLang = async () => {
  try {
    console.log("Fetching languages...");
    const response = await fetch(
      "https://microsoft-translator-text-api3.p.rapidapi.com/languages",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": "YOUR_API_KEY",

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
  chrome.storage.sync.get("preferredLang", (data) => {
    console.log("Preferred language:", data);
    const lang = data.preferredLang?.value;
    const langContent = data.preferredLang?.text;
    if (lang && langContent) {
      document.getElementById(
        "selectedlang"
      ).innerText = `Your Selected Lang: ${langContent}`;
    } else {
      document.getElementById(
        "selectedlang"
      ).innerText = `No Language Selected yet!`;
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentTab = tabs[0];
    const langs = document.querySelector("#languages");
    const no_langs = document.getElementById("no-lang");
    const messageBox = document.getElementById("navigator-section");
    const saveBtn = document.getElementById("saveBtn");
    const languageSection = document.getElementById("languageSection");
    const previoslySelectedLang = document.getElementById("prevselectedlang");

    if (currentTab.url.includes("https://web.whatsapp.com")) {
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
      } else {
        languageSection.style.display = "none";
        saveBtn.style.display = "none";
        no_langs.innerText = "Failed to load languages :(";
        no_langs.innerHTML +=
          "<br><br>Please check your API key and try again.";
      }
    } else {
      saveBtn.style.display = "none";
      messageBox.style.display = "flex";
      languageSection.style.display = "none";
      previoslySelectedLang.style.display = "none";
    }
  });
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const langSelect = document.getElementById("languages");
  const lang = langSelect.value;
  const langContent = langSelect.options[langSelect.selectedIndex].text;

  console.log("Lang content:", langContent);
  console.log("Selected language:", lang);

  chrome.storage.sync.set(
    { preferredLang: { text: langContent, value: lang } },
    () => {
      console.log("Language saved:", { text: langContent, value: lang });
      const confirmation = document.getElementById("confirmation");
      const selectedLang = document.getElementById("selectedlang");
      const lastError = chrome.runtime.lastError;

      if (lastError) {
        console.error("Error saving language:", lastError);
        confirmation.style.color = "#FF0000";
        confirmation.innerText = "Something went wrong!";
      } else {
        console.log("Language saved:", lang);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "setLanguage",
            lang: lang,
          });
        });
        selectedLang.innerText = `Your Selected Lang: ${langContent}`;
        confirmation.style.color = "#25D366";
        confirmation.innerText = "Language preference saved!";
      }
    }
  );
});
