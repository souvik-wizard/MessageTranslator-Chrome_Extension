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
    const observer = new MutationObserver((mutations) => {
      console.log(mutations[0].target.innerText, "mutations");
      renderTranslateButton();
    });

    observer.observe(chatContainer, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
};

// This is kinda final solution , it is working fine for now adding the translated text in the next line along with the original message
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
    console.log(translatedText, "translatedText");

    // Updated selector to specifically target the chat input field
    const inputField = document.querySelector(
      "div[contenteditable='true'][role='textbox'][aria-placeholder='Type a message']"
    );
    console.log(inputField, "inputField");

    if (inputField) {
      // Focus the input field
      inputField.focus();

      // Simulate pasting text
      const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: new DataTransfer(),
      });
      pasteEvent.clipboardData.setData("text/plain", "\n" + translatedText);
      inputField.dispatchEvent(pasteEvent);

      // If the paste event doesn't work, fall back to setting innerHTML
      if (!inputField.textContent.includes(translatedText)) {
        const p = inputField.querySelector("p");
        if (p) {
          p.innerHTML = inputField.textContent; // preserve existing text
          const br = document.createElement("br");
          p.appendChild(br);
          const translatedSpan = document.createElement("span");
          translatedSpan.className = "selectable-text copyable-text";
          translatedSpan.setAttribute("data-lexical-text", "true");
          translatedSpan.textContent = translatedText;
          p.appendChild(translatedSpan);
        }
      }

      // Dispatch multiple events to ensure WhatsApp's state is updated
      ["input", "change", "blur", "focus"].forEach((eventType) => {
        inputField.dispatchEvent(new Event(eventType, { bubbles: true }));
      });

      // Move the cursor to the end
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(inputField);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      console.error("Chat input field not found");
    }
  } catch (error) {
    console.error("Translation error:", error);
  }
};

// Start observing the DOM after the page is fully loaded
window.addEventListener("load", () => {
  renderTranslateButton();
  observeChatChanges();
});

//This is working but inserting the translated text at the end of the message along with the original message--------------------
// const translateInputMessage = async (messageText, targetLang) => {
//   try {
//     const response = await new Promise((resolve, reject) => {
//       chrome.runtime.sendMessage(
//         { action: "translate", text: messageText, targetLang },
//         (response) => {
//           if (chrome.runtime.lastError) {
//             reject(chrome.runtime.lastError);
//           } else {
//             resolve(response);
//           }
//         }
//       );
//     });

//     if (response.error) {
//       console.error(response.error);
//       return;
//     }

//     const translatedText = response.translatedText;
//     console.log(translatedText, "translatedText");

//     // Updated selector to specifically target the chat input field
//     const inputField = document.querySelector(
//       "div[contenteditable='true'][role='textbox'][aria-placeholder='Type a message']"
//     );
//     console.log(inputField, "inputField");

//     if (inputField) {
//       // Focus the input field
//       inputField.focus();

//       // Simulate pasting text
//       const pasteEvent = new ClipboardEvent("paste", {
//         bubbles: true,
//         cancelable: true,
//         clipboardData: new DataTransfer(),
//       });
//       pasteEvent.clipboardData.setData("text/plain", translatedText);
//       inputField.dispatchEvent(pasteEvent);

//       // If the paste event doesn't work, fall back to setting innerHTML
//       if (!inputField.textContent.includes(translatedText)) {
//         const p = inputField.querySelector("p");
//         if (p) {
//           const span = document.createElement("span");
//           span.className = "selectable-text copyable-text";
//           span.setAttribute("data-lexical-text", "true");
//           span.textContent = translatedText;
//           p.innerHTML = "";
//           p.appendChild(span);
//         }
//       }

//       // Dispatch multiple events to ensure WhatsApp's state is updated
//       ["input", "change", "blur", "focus"].forEach((eventType) => {
//         inputField.dispatchEvent(new Event(eventType, { bubbles: true }));
//       });

//       // Move the cursor to the end
//       const selection = window.getSelection();
//       const range = document.createRange();
//       range.selectNodeContents(inputField);
//       range.collapse(false);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     } else {
//       console.error("Chat input field not found");
//     }
//   } catch (error) {
//     console.error("Translation error:", error);
//   }
// };

//This is working for single word ------------------------------------------------------------------------
// const translateInputMessage = async (messageText, targetLang) => {
//   try {
//     const response = await new Promise((resolve, reject) => {
//       chrome.runtime.sendMessage(
//         { action: "translate", text: messageText, targetLang },
//         (response) => {
//           if (chrome.runtime.lastError) {
//             reject(chrome.runtime.lastError);
//           } else {
//             resolve(response);
//           }
//         }
//       );
//     });

//     if (response.error) {
//       console.error(response.error);
//       return;
//     }

//     const translatedText = response.translatedText;
//     console.log(translatedText, "translatedText");

//     const inputField = document.querySelector(
//       "div[contenteditable='true'][role='textbox']"
//     );
//     console.log(inputField, "inputField");

//     if (inputField) {
//       // Focus the input field
//       inputField.focus();

//       // Select all existing content
//       const selection = window.getSelection();
//       const range = document.createRange();
//       range.selectNodeContents(inputField);
//       selection.removeAllRanges();
//       selection.addRange(range);

//       // Replace the selected content with the translated text
//       document.execCommand("insertText", false, translatedText);

//       // Dispatch 'input' event to trigger WhatsApp's state update
//       inputField.dispatchEvent(new InputEvent("input", { bubbles: true }));

//       // Optionally, move the cursor to the end
//       range.collapse(false);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   } catch (error) {
//     console.error("Translation error:", error);
//   }
// };

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
