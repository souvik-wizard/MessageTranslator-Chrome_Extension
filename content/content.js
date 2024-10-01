chrome.storage.sync.get(['preferredLang'], ({ preferredLang }) => {
    const messageBox = document.querySelector('[contenteditable="true"]');
    const sendButton = document.querySelector('button[type="button"]');
  
    sendButton.addEventListener('click', () => {
      const text = messageBox.innerText;
      if (text) {
        chrome.runtime.sendMessage({
          action: 'translate',
          text: text,
          targetLang: preferredLang || 'en'
        }, (response) => {
          messageBox.innerText = response.translatedText;
        });
      }
    });
  });
  