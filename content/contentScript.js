console.log("Hello from contentScript.js");

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

// Create the translate button
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

const renderTranslateButton = () => {
  const replaceTag = document.getElementsByClassName(`_ak1r`)[0];
  if (replaceTag) {
    replaceTag.appendChild(translateButton);

    translateButton.addEventListener("click", () => {
      const messageText = replaceTag.children[0].innerText;
      console.log(messageText, "messageText");
      chrome.storage.sync.get("preferredLang", ({ preferredLang }) => {
        if (preferredLang) {
          console.log(preferredLang, "preferredLang");
          translateInputMessage(messageText, preferredLang);
        }
      });
    });
  } else {
    console.error("Pref Lang not found");
    setTimeout(renderTranslateButton, 100);
  }
};

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

    let isTranslating = false;
    const translatedText = response.translatedText;
    const replaceTag = document.querySelector(".x1hx0egp[data-tab='10']");

    if (replaceTag && !isTranslating) {
      isTranslating = true;

      // Focus the input field
      replaceTag.focus();

      // Select all content and delete it to remove original text
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);

      // Insert translated text as if typed by user
      document.execCommand("insertText", false, translatedText);

      // Dispatch 'input' event to inform WhatsApp of the change
      replaceTag.dispatchEvent(new InputEvent("input", { bubbles: true }));

      setTimeout(() => {
        isTranslating = false;
      }, 1000);
    }
  } catch (error) {
    console.error("Translation error:", error);
  }
};

const findParent = () => {
  const targetNode = document.getElementsByClassName("_aigv _aigz")[1];
  console.log(targetNode, "targetNode");
  if (targetNode) {
    const mutationObserver = new MutationObserver((mutations) => {
      console.log(mutations, "mutations");
    });

    mutationObserver.observe(targetNode, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  } else {
    console.log("targetNode not found");
    setTimeout(findParent, 1000);
  }
};

window.addEventListener("load", () => {
  renderTranslateButton();
  findParent();
});
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
