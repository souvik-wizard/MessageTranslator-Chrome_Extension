console.log("Hello from contentScript.js");

const translateMessage = (messageText, targetLang) => {
  chrome.runtime.sendMessage(
    { action: "translate", text: messageText, targetLang },
    (response) => {
      if (response?.error) {
        console.error(response.error);
        return;
      }
      const translatedText = response.translatedText;
      // Modify DOM with translated message
      const messageElements = document.querySelectorAll(".selectable-text");
      messageElements.forEach((element) => {
        if (element.innerText === messageText) {
          element.innerText = translatedText;
        }
      });
    }
  );
};

// Create the translate button
const translateButton = document.createElement("button");
translateButton.innerText = "Translate";
translateButton.id = "translateButton";
translateButton.style.cssText = `
  background-color: #25D366;
  color: white;
  border: none;
  padding: 4px;
  right: 0;
  top: 0;
  position: absolute; 
  border-radius: 5px;
  cursor: pointer;
`;

window.addEventListener("load", (event) => {
  setTimeout(() => {
    const inputContainer = document.getElementsByClassName(
      `lexical-rich-text-input`
    )[0];
    console.log(inputContainer, "inputContainer");
    if (inputContainer) {
      inputContainer.appendChild(translateButton);

      translateButton.addEventListener("click", () => {
        const messageText = inputContainer.children[0].innerText;
        console.log(messageText, "messageText");
        chrome.storage.sync.get("preferredLang", ({ preferredLang }) => {
          if (preferredLang) {
            console.log(preferredLang, "preferredLang");
            translateInputMessage(messageText, preferredLang, inputContainer);
          }
        });
      });
    }
  }, 5000);
});

const translateInputMessage = async (
  messageText,
  targetLang,
  inputContainer
) => {
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

    console.log(response, "response");
    const translatedText = response.translatedText;
    if (inputContainer) {
      inputContainer.innerText = translatedText;
    }
  } catch (error) {
    console.error("Translation error:", error);
  }
};

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
