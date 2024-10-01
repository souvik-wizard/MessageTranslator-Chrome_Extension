document.addEventListener('DOMContentLoaded', async () => {

    const langs = document.querySelector("#languages");
    // chrome.storage.sync.get(['languages'], ({ languages }) => {
    //     if (languages) {
    //         const { langCodes, langNames } = languages;
    //         langs.innerHTML = ''; // Clear previous options

    //         for (let i = 0; i < langCodes.length; i++) {
    //             langs.innerHTML += `<option value="${langCodes[i]}">${langNames[i].name}</option>`;
    //         }
    //     }
    // });

    // Save language selection on button click
    document.getElementById('saveBtn').addEventListener('click', () => {
        const lang = document.getElementById('languages').value;
        // chrome.storage.sync.set({ preferredLang: lang }, () => {
        //     alert('Language saved!');
        // });
    });
});
