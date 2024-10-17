console.log("Hello from contentScript.js");

const createTranslateButton = () => {
  const translateButton = document.createElement("button");
  translateButton.innerText = "Translate";
  translateButton.id = "translateButton";
  translateButton.style.cssText = `
    background-color: #25D366;
    color: white;
    border: none;
    padding: 4px;
    right: 60px;
    top: 14px;
    position: absolute; 
    border-radius: 5px;
    cursor: pointer;
  `;

  const messageContainer = document.getElementsByClassName(`_ak1r`)[0];
  translateButton.addEventListener("click", () => {
    const messageText = messageContainer.children[0].innerText;
    console.log(messageText, "messageText");

    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get("preferredLang", ({ preferredLang }) => {
        if (preferredLang) {
          console.log(preferredLang, "preferredLang");
          translateInputMessage(messageText, preferredLang);
        } else {
          console.log("No preferred language selected");
        }
      });
    } else {
      console.error("Chrome storage is not available");
    }
  });

  return translateButton;
};

const renderTranslateButton = () => {
  const replaceTag = document.getElementsByClassName("_ak1r")[0];
  const existingButton = document.getElementById("translateButton");

  if (replaceTag && !existingButton) {
    const translateButton = createTranslateButton();
    replaceTag.appendChild(translateButton);
  }
};

// Monitor DOM for chat changes
const observeChatChanges = () => {
  const chatContainer = document.querySelector("#app");
  if (chatContainer) {
    const observer = new MutationObserver(() => {
      renderTranslateButton();
    });

    observer.observe(chatContainer, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
};

// Translate input message function
const translateInputMessage = async (messageText, targetLang) => {
  try {
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { action: "translate", text: messageText, targetLang },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        }
      );
    });

    if (response.error) {
      console.error(response.error);
      return;
    }

    const translatedText = response.translatedText;
    const inputField = document.querySelector(".x1hx0egp[data-tab='10']");

    if (inputField) {
      inputField.focus();
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);
      document.execCommand("insertText", false, translatedText);
      inputField.dispatchEvent(new InputEvent("input", { bubbles: true }));
    }
  } catch (error) {
    console.error("Translation error:", error);
  }
};

// Start observing the DOM after the page is fully loaded
window.addEventListener("load", () => {
  renderTranslateButton(); // Render button for the first time
  observeChatChanges(); // Start monitoring chat changes
});

// const translateMessage = (messageText, targetLang) => {
//   chrome.runtime.sendMessage(
//     { action: "translate", text: messageText, targetLang },
//     (response) => {
//       if (response?.error) {
//         console.error(response.error);
//         return;
//       }
//       const translatedText = response.translatedText;
//       // Modify DOM with translated message
//       const messageElements = document.querySelectorAll(".selectable-text");
//       messageElements.forEach((element) => {
//         if (element.innerText === messageText) {
//           element.innerText = translatedText;
//         }
//       });
//     }
//   );
// };

// const target = document.getElementsByClassName(
//   "x1hx0egp x6ikm8r x1odjw0f x1k6rcq7 x6prxxf"
// )[0];
// console.log(target, "target");
// const observer = new MutationObserver(callback);

// observer.observe(target, { attributes: true, childList: true, subtree: true });

// function callback(mutations) {
//   mutations.forEach((mutation) => {
//     console.log(
//       `Attribute ${
//         mutation.attributeName
//       } changed to ${mutation.target.getAttribute(mutation.attributeName)}`
//     );
//   });
// }

// if (targetNode) {
//   observer.observe(targetNode, {
//     childList: true,
//     subtree: true,
//     attributes: true,
//   });
// } else {
//   console.error("Target node not found");
// }

// Add event listener to the translate button
// const translateButton = document.querySelector("#yourTranslateButtonId"); // Replace with your button's actual ID
// translateButton.addEventListener("click", () => {
//   const messageText = document.querySelector(
//     '[contenteditable="true"]'
//   ).innerText;
//   chrome.storage.sync.get("preferredLang", ({ preferredLang }) => {
//     if (preferredLang) {
//       translateInputMessage(messageText, preferredLang);
//     }
//   });
// });

// const observer = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     if (mutation.addedNodes.length) {
//       const newNode = mutation.addedNodes[0];
//       if (newNode.innerText) {
//         const newMessage = newNode.innerText;
//         chrome.storage.sync.get("preferredLang", ({ preferredLang }) => {
//           if (preferredLang) {
//             translateMessage(newMessage, preferredLang);
//           }
//         });
//       }
//     }
//   });
// });

// const targetNode = document.querySelector(".messages-container-selector"); // Update with the correct selector
// if (targetNode) {
//   observer.observe(targetNode, { childList: true, subtree: true });
// } else {
//   console.error("Target node not found");
// }
