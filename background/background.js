console.log('Background script loaded');

const fetchLang = async () => {
    try {
        console.log('Fetching languages...');
        const response = await fetch('https://microsoft-translator-text-api3.p.rapidapi.com/languages', {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'YOUR_API_KEY',
                'x-rapidapi-host': 'microsoft-translator-text-api3.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched languages:', data);
        let languages = data.translation;
        let langCodes = Object.keys(languages);
        let langNames = Object.values(languages).map(lang => lang.name);
        
        // Save languages in storage
        chrome.storage.sync.set({ languages: { langCodes, langNames } });
    } catch (error) {
        console.error('Failed to fetch languages:', error);
    }
};

// Event listeners
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated');
    fetchLang();
});

chrome.runtime.onStartup.addListener(() => {
    console.log('Chrome started');
    fetchLang();
});


// Handle translation requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'translate') {
        const { text, targetLang } = request;
        fetch(`https://microsoft-translator-text-api3.p.rapidapi.com/translate?to=${targetLang}&from=en&textType=plain`, {
            method: 'POST',
            headers: {
                'x-rapidapi-key': 'b772aa655cmshd6b3aab9ad7d7e0p10a524jsn57a88a590afb',
                'x-rapidapi-host': 'microsoft-translator-text-api3.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ Text: text }])
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            sendResponse({ translatedText: data[0].translations[0].text });
        })
        .catch(err => console.error('Translation Error:', err));
        return true; // Keep the message channel open for sendResponse
    }
});
