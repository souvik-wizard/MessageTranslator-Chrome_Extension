console.log("Hello from contentScript.js");
const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const createTranslateButtonForMessage = (messageElement) => {
  if (messageElement.querySelector(".translate-msg-btn")) {
    return; // Button already exists, no need to add another
  }

  const translateButton = document.createElement("button");
  translateButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" viewBox="0 0 256 256" fill="#FFFFFF" xml:space="preserve">
  <defs>
  </defs>
  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
    <path d="M 45 16.495 c -13.512 0 -24.504 10.993 -24.504 24.504 c 0 13.512 10.993 24.504 24.504 24.504 c 13.512 0 24.504 -10.992 24.504 -24.504 C 69.504 27.488 58.512 16.495 45 16.495 z M 62.771 30.816 h -7.53 c -0.682 -3.421 -1.714 -6.551 -3.083 -9.005 C 56.655 23.494 60.404 26.702 62.771 30.816 z M 65.503 40.999 c 0 2.154 -0.338 4.23 -0.957 6.183 h -8.683 c 0.234 -2.037 0.355 -4.121 0.355 -6.183 c 0 -2.062 -0.121 -4.146 -0.355 -6.183 h 8.683 C 65.165 36.769 65.503 38.845 65.503 40.999 z M 45 61.503 c -2.093 0 -4.756 -3.768 -6.191 -10.32 h 12.382 C 49.757 57.735 47.093 61.503 45 61.503 z M 38.145 47.182 c -0.228 -1.904 -0.362 -3.964 -0.362 -6.183 c 0 -2.219 0.135 -4.278 0.362 -6.183 h 13.711 c 0.228 1.904 0.362 3.964 0.362 6.183 c 0 2.219 -0.135 4.278 -0.362 6.183 H 38.145 z M 24.497 40.999 c 0 -2.154 0.338 -4.23 0.957 -6.183 h 8.683 c -0.234 2.037 -0.355 4.121 -0.355 6.183 c 0 2.062 0.121 4.146 0.355 6.183 h -8.683 C 24.835 45.23 24.497 43.154 24.497 40.999 z M 45 20.496 c 2.093 0 4.757 3.768 6.191 10.32 H 38.809 C 40.244 24.264 42.907 20.496 45 20.496 z M 37.842 21.811 c -1.369 2.454 -2.401 5.584 -3.083 9.005 h -7.53 C 29.596 26.702 33.345 23.494 37.842 21.811 z M 27.229 51.183 h 7.53 c 0.682 3.421 1.714 6.551 3.083 9.005 C 33.345 58.504 29.596 55.297 27.229 51.183 z M 52.158 60.188 c 1.369 -2.454 2.401 -5.584 3.083 -9.005 h 7.53 C 60.404 55.297 56.655 58.504 52.158 60.188 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255, 255, 255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
    <path d="M 77.211 15.773 l 6.668 0.574 c 1.1 0.084 2.071 -0.721 2.164 -1.822 c 0.095 -1.101 -0.72 -2.07 -1.821 -2.164 l -11.623 -1 c -0.027 -0.002 -0.053 0.002 -0.079 0.001 c -0.072 -0.003 -0.143 -0.002 -0.214 0.003 c -0.06 0.004 -0.12 0.008 -0.179 0.017 c -0.065 0.01 -0.129 0.025 -0.193 0.041 c -0.063 0.016 -0.125 0.033 -0.186 0.055 c -0.059 0.021 -0.116 0.047 -0.173 0.074 c -0.061 0.029 -0.12 0.059 -0.178 0.094 c -0.054 0.033 -0.106 0.07 -0.157 0.108 c -0.033 0.024 -0.069 0.042 -0.1 0.069 c -0.022 0.019 -0.039 0.043 -0.061 0.063 c -0.021 0.019 -0.045 0.033 -0.065 0.053 c -0.027 0.027 -0.045 0.058 -0.07 0.086 c -0.045 0.05 -0.088 0.101 -0.127 0.156 c -0.04 0.055 -0.077 0.112 -0.111 0.171 c -0.031 0.053 -0.059 0.106 -0.085 0.161 c -0.03 0.064 -0.055 0.129 -0.078 0.195 c -0.019 0.056 -0.036 0.112 -0.05 0.169 c -0.017 0.07 -0.03 0.139 -0.039 0.21 c -0.004 0.032 -0.015 0.063 -0.018 0.095 l -1 11.624 c -0.095 1.101 0.721 2.07 1.821 2.164 c 0.059 0.005 0.116 0.007 0.174 0.007 c 1.028 0 1.902 -0.787 1.991 -1.829 l 0.6 -6.969 c 5.031 6.434 7.769 14.305 7.769 22.602 c 0 9.826 -3.827 19.065 -10.774 26.013 c -0.939 0.938 -1.974 1.86 -3.078 2.742 c -0.589 0.472 -0.863 1.235 -0.709 1.973 l 2.447 11.68 l -10.049 -7.604 c -0.544 -0.411 -1.262 -0.519 -1.898 -0.282 c -10.44 3.842 -22.328 2.7 -31.803 -3.052 c -0.944 -0.575 -2.174 -0.273 -2.748 0.671 c -0.573 0.944 -0.273 2.174 0.671 2.748 c 10.194 6.19 22.904 7.566 34.22 3.755 l 13.451 10.178 c 0.356 0.27 0.781 0.405 1.207 0.405 c 0.371 0 0.743 -0.103 1.07 -0.311 c 0.705 -0.446 1.059 -1.283 0.888 -2.1 l -3.294 -15.722 c 0.863 -0.733 1.685 -1.486 2.45 -2.25 C 88.526 54.941 89.642 31.761 77.211 15.773 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255, 255, 255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
    <path d="M 18.744 54.593 c -1.088 -0.105 -2.069 0.72 -2.164 1.821 l -0.599 6.964 C 4.736 48.957 5.731 28.024 18.986 14.768 C 30.642 3.114 48.786 0.639 63.114 8.75 c 0.961 0.544 2.181 0.207 2.726 -0.755 c 0.544 -0.961 0.206 -2.182 -0.755 -2.726 C 49.199 -3.727 29.081 -0.984 16.158 11.94 C 1.474 26.623 0.359 49.803 12.79 65.791 l -6.67 -0.574 c -1.094 -0.104 -2.069 0.721 -2.164 1.821 c -0.095 1.101 0.721 2.07 1.822 2.164 l 11.624 1 c 0.057 0.006 0.113 0.008 0.169 0.008 c 0.001 0 0.001 0 0.002 0 c 0 0 0.001 0 0.001 0 c 0.001 0 0.001 0 0.002 0 c 0.129 0 0.256 -0.013 0.379 -0.037 c 0.003 0 0.005 -0.002 0.008 -0.002 c 0.122 -0.024 0.24 -0.059 0.353 -0.105 c 0.036 -0.015 0.07 -0.037 0.106 -0.053 c 0.079 -0.037 0.157 -0.074 0.23 -0.121 c 0.038 -0.024 0.072 -0.055 0.108 -0.082 c 0.068 -0.05 0.135 -0.101 0.196 -0.16 c 0.01 -0.01 0.022 -0.016 0.031 -0.026 c 0.025 -0.025 0.043 -0.055 0.067 -0.082 c 0.054 -0.06 0.106 -0.12 0.152 -0.186 c 0.031 -0.045 0.058 -0.091 0.086 -0.138 c 0.036 -0.062 0.071 -0.125 0.1 -0.191 c 0.024 -0.054 0.044 -0.108 0.063 -0.163 c 0.022 -0.063 0.041 -0.126 0.057 -0.192 c 0.015 -0.062 0.025 -0.124 0.034 -0.186 c 0.005 -0.036 0.016 -0.069 0.019 -0.105 l 1 -11.624 C 20.66 55.657 19.844 54.688 18.744 54.593 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255, 255, 255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
  </g>
  </svg>`;
  translateButton.className = "translate-msg-btn";
  translateButton.style.cssText = `
    background-color: #25D366;
    color: white;
    border: none;
    padding: 4px;
    margin-top: 5px;
    border-radius: 100%;
    cursor: pointer;
    display: none;
  `;

  // Add event listener to translate the specific message
  translateButton.addEventListener("click", () => {
    const messageText =
      messageElement.querySelector(".selectable-text").innerText;

    // console.log(`Translating message: ${messageText}`);
    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get("preferredLang", ({ preferredLang }) => {
        // console.log("Preferred language:", preferredLang.value);
        if (preferredLang) {
          translateMessage(messageText, preferredLang.value, messageElement);
          translateButton.disabled = true;
          translateButton.style.visibility = "hidden";
        } else {
          console.log("No preferred language selected");
        }
      });
    } else {
      console.error("Chrome storage is not available");
    }
  });

  // Append the button to the message element
  messageElement.appendChild(translateButton);

  // Show the button on hover
  messageElement.addEventListener("mouseenter", () => {
    translateButton.style.display = "block";
  });

  // Hide the button when not hovering
  messageElement.addEventListener("mouseleave", () => {
    translateButton.style.display = "none";
  });
};

const addTranslateButtonToAllMessages = () => {
  const messageElements = document.querySelectorAll(
    "div[role='row'] .message-out, div[role='row'] .message-in"
  );
  messageElements.forEach(createTranslateButtonForMessage);
};

const translateMessage = async (messageText, targetLang, messageElement) => {
  try {
    const translatedSpan = document.createElement("span");
    translatedSpan.className = "translated-text";
    translatedSpan.style.cssText = `
      display: block;
      color:black;
      background-color: #25D366;
      padding: 8px;
      font-size: small;
      border-radius: 8px;
      margin-bottom: 10px;
      word-break: break-all;
    `;

    // Add SVG loader
    translatedSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 200 200">
        <circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="40" cy="65">
          <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
        </circle>
        <circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="100" cy="65">
          <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
        </circle>
        <circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="160" cy="65">
          <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
        </circle>
      </svg>
    `;

    // Append translated text below the original message
    messageElement.children[1].appendChild(translatedSpan);

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
      translatedSpan.innerText = "Translation failed";
    } else {
      const translatedText = response.translatedText;
      // console.log(translatedText, "translatedText");
      translatedSpan.innerHTML = "";
      translatedSpan.innerText = translatedText;
    }
  } catch (error) {
    console.error("Translation error:", error);
  }
};

const renderTranslateButton = () => {
  const replaceTag = document.getElementsByClassName("_ak1r")[0];
  const existingButton = document.getElementById("translateButton");

  if (replaceTag && !existingButton) {
    const translateButton = createTranslateButton();
    replaceTag.appendChild(translateButton);
  }
};

const createTranslateButton = () => {
  const translateButton = document.createElement("button");
  translateButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" viewBox="0 0 256 256" fill="#FFFFFF" xml:space="preserve">
  <defs>
  </defs>
  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
    <path d="M 45 16.495 c -13.512 0 -24.504 10.993 -24.504 24.504 c 0 13.512 10.993 24.504 24.504 24.504 c 13.512 0 24.504 -10.992 24.504 -24.504 C 69.504 27.488 58.512 16.495 45 16.495 z M 62.771 30.816 h -7.53 c -0.682 -3.421 -1.714 -6.551 -3.083 -9.005 C 56.655 23.494 60.404 26.702 62.771 30.816 z M 65.503 40.999 c 0 2.154 -0.338 4.23 -0.957 6.183 h -8.683 c 0.234 -2.037 0.355 -4.121 0.355 -6.183 c 0 -2.062 -0.121 -4.146 -0.355 -6.183 h 8.683 C 65.165 36.769 65.503 38.845 65.503 40.999 z M 45 61.503 c -2.093 0 -4.756 -3.768 -6.191 -10.32 h 12.382 C 49.757 57.735 47.093 61.503 45 61.503 z M 38.145 47.182 c -0.228 -1.904 -0.362 -3.964 -0.362 -6.183 c 0 -2.219 0.135 -4.278 0.362 -6.183 h 13.711 c 0.228 1.904 0.362 3.964 0.362 6.183 c 0 2.219 -0.135 4.278 -0.362 6.183 H 38.145 z M 24.497 40.999 c 0 -2.154 0.338 -4.23 0.957 -6.183 h 8.683 c -0.234 2.037 -0.355 4.121 -0.355 6.183 c 0 2.062 0.121 4.146 0.355 6.183 h -8.683 C 24.835 45.23 24.497 43.154 24.497 40.999 z M 45 20.496 c 2.093 0 4.757 3.768 6.191 10.32 H 38.809 C 40.244 24.264 42.907 20.496 45 20.496 z M 37.842 21.811 c -1.369 2.454 -2.401 5.584 -3.083 9.005 h -7.53 C 29.596 26.702 33.345 23.494 37.842 21.811 z M 27.229 51.183 h 7.53 c 0.682 3.421 1.714 6.551 3.083 9.005 C 33.345 58.504 29.596 55.297 27.229 51.183 z M 52.158 60.188 c 1.369 -2.454 2.401 -5.584 3.083 -9.005 h 7.53 C 60.404 55.297 56.655 58.504 52.158 60.188 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255, 255, 255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
    <path d="M 77.211 15.773 l 6.668 0.574 c 1.1 0.084 2.071 -0.721 2.164 -1.822 c 0.095 -1.101 -0.72 -2.07 -1.821 -2.164 l -11.623 -1 c -0.027 -0.002 -0.053 0.002 -0.079 0.001 c -0.072 -0.003 -0.143 -0.002 -0.214 0.003 c -0.06 0.004 -0.12 0.008 -0.179 0.017 c -0.065 0.01 -0.129 0.025 -0.193 0.041 c -0.063 0.016 -0.125 0.033 -0.186 0.055 c -0.059 0.021 -0.116 0.047 -0.173 0.074 c -0.061 0.029 -0.12 0.059 -0.178 0.094 c -0.054 0.033 -0.106 0.07 -0.157 0.108 c -0.033 0.024 -0.069 0.042 -0.1 0.069 c -0.022 0.019 -0.039 0.043 -0.061 0.063 c -0.021 0.019 -0.045 0.033 -0.065 0.053 c -0.027 0.027 -0.045 0.058 -0.07 0.086 c -0.045 0.05 -0.088 0.101 -0.127 0.156 c -0.04 0.055 -0.077 0.112 -0.111 0.171 c -0.031 0.053 -0.059 0.106 -0.085 0.161 c -0.03 0.064 -0.055 0.129 -0.078 0.195 c -0.019 0.056 -0.036 0.112 -0.05 0.169 c -0.017 0.07 -0.03 0.139 -0.039 0.21 c -0.004 0.032 -0.015 0.063 -0.018 0.095 l -1 11.624 c -0.095 1.101 0.721 2.07 1.821 2.164 c 0.059 0.005 0.116 0.007 0.174 0.007 c 1.028 0 1.902 -0.787 1.991 -1.829 l 0.6 -6.969 c 5.031 6.434 7.769 14.305 7.769 22.602 c 0 9.826 -3.827 19.065 -10.774 26.013 c -0.939 0.938 -1.974 1.86 -3.078 2.742 c -0.589 0.472 -0.863 1.235 -0.709 1.973 l 2.447 11.68 l -10.049 -7.604 c -0.544 -0.411 -1.262 -0.519 -1.898 -0.282 c -10.44 3.842 -22.328 2.7 -31.803 -3.052 c -0.944 -0.575 -2.174 -0.273 -2.748 0.671 c -0.573 0.944 -0.273 2.174 0.671 2.748 c 10.194 6.19 22.904 7.566 34.22 3.755 l 13.451 10.178 c 0.356 0.27 0.781 0.405 1.207 0.405 c 0.371 0 0.743 -0.103 1.07 -0.311 c 0.705 -0.446 1.059 -1.283 0.888 -2.1 l -3.294 -15.722 c 0.863 -0.733 1.685 -1.486 2.45 -2.25 C 88.526 54.941 89.642 31.761 77.211 15.773 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255, 255, 255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
    <path d="M 18.744 54.593 c -1.088 -0.105 -2.069 0.72 -2.164 1.821 l -0.599 6.964 C 4.736 48.957 5.731 28.024 18.986 14.768 C 30.642 3.114 48.786 0.639 63.114 8.75 c 0.961 0.544 2.181 0.207 2.726 -0.755 c 0.544 -0.961 0.206 -2.182 -0.755 -2.726 C 49.199 -3.727 29.081 -0.984 16.158 11.94 C 1.474 26.623 0.359 49.803 12.79 65.791 l -6.67 -0.574 c -1.094 -0.104 -2.069 0.721 -2.164 1.821 c -0.095 1.101 0.721 2.07 1.822 2.164 l 11.624 1 c 0.057 0.006 0.113 0.008 0.169 0.008 c 0.001 0 0.001 0 0.002 0 c 0 0 0.001 0 0.001 0 c 0.001 0 0.001 0 0.002 0 c 0.129 0 0.256 -0.013 0.379 -0.037 c 0.003 0 0.005 -0.002 0.008 -0.002 c 0.122 -0.024 0.24 -0.059 0.353 -0.105 c 0.036 -0.015 0.07 -0.037 0.106 -0.053 c 0.079 -0.037 0.157 -0.074 0.23 -0.121 c 0.038 -0.024 0.072 -0.055 0.108 -0.082 c 0.068 -0.05 0.135 -0.101 0.196 -0.16 c 0.01 -0.01 0.022 -0.016 0.031 -0.026 c 0.025 -0.025 0.043 -0.055 0.067 -0.082 c 0.054 -0.06 0.106 -0.12 0.152 -0.186 c 0.031 -0.045 0.058 -0.091 0.086 -0.138 c 0.036 -0.062 0.071 -0.125 0.1 -0.191 c 0.024 -0.054 0.044 -0.108 0.063 -0.163 c 0.022 -0.063 0.041 -0.126 0.057 -0.192 c 0.015 -0.062 0.025 -0.124 0.034 -0.186 c 0.005 -0.036 0.016 -0.069 0.019 -0.105 l 1 -11.624 C 20.66 55.657 19.844 54.688 18.744 54.593 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255, 255, 255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
  </g>
  </svg>`;
  translateButton.id = "translateButton";
  translateButton.style.cssText = `
    background-color: #25D366;
    color: white;
    border: none;
    padding: 4px;
    right: 60px;
    top: 12px;
    position: absolute; 
    border-radius: 100%;
    cursor: pointer;
  `;
  const messageContainer = document.getElementsByClassName(`_ak1r`)[0];
  translateButton.addEventListener("click", async () => {
    const messageText = messageContainer.children[0].innerText;
    // console.log(messageText, "messageText");

    // Disable the button while fetching the translation
    translateButton.disabled = true;
    translateButton.style.cursor = "not-allowed";

    try {
      if (chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get("preferredLang", ({ preferredLang }) => {
          if (preferredLang) {
            // console.log(preferredLang.value, "preferredLang");
            translateInputMessage(messageText, preferredLang.value).finally(
              () => {
                // Re-enable the button after translation is done
                translateButton.disabled = false;
                translateButton.style.cursor = "pointer";
              }
            );
          } else {
            console.log("No preferred language selected");
            translateButton.disabled = false;
            translateButton.style.cursor = "pointer";
          }
        });
      } else {
        console.error("Chrome storage is not available");
      }
    } catch (error) {
      console.error("Translation failed", error);
      translateButton.disabled = false;
      translateButton.style.cursor = "pointer";
    }
  });

  return translateButton;
};

// Translate input message functionality
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
    // console.log(translatedText, "translatedText");

    const inputField = document.querySelector(
      "div[contenteditable='true'][role='textbox'][aria-placeholder='Type a message']"
    );
    // console.log(inputField, "inputField");

    if (inputField) {
      inputField.focus();

      const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: new DataTransfer(),
      });
      pasteEvent.clipboardData.setData("text/plain", "\n" + translatedText);
      inputField.dispatchEvent(pasteEvent);

      if (!inputField.textContent.includes(translatedText)) {
        const p = inputField.querySelector("p");
        if (p) {
          p.innerHTML = inputField.textContent;
          const br = document.createElement("br");
          p.appendChild(br);
          const translatedSpan = document.createElement("span");
          translatedSpan.className = "selectable-text copyable-text";
          translatedSpan.setAttribute("data-lexical-text", "true");
          translatedSpan.textContent = translatedText;
          p.appendChild(translatedSpan);
        }
      }

      ["input", "change", "blur", "focus"].forEach((eventType) => {
        inputField.dispatchEvent(new Event(eventType, { bubbles: true }));
      });

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

// Monitor DOM for chat changes
const observeChatChanges = () => {
  const chatContainer = document.querySelector("#app");
  if (chatContainer) {
    const observer = new MutationObserver((mutations) => {
      observer.disconnect(); // Temporarily disconnect to avoid re-triggering
      debouncedRenderTranslateButton();
      debouncedAddTranslateButtonToAllMessages();
      observer.observe(chatContainer, {
        childList: true,
        subtree: true,
      });
    });

    observer.observe(chatContainer, {
      childList: true,
      subtree: true,
    });
  }
};

const debouncedRenderTranslateButton = debounce(renderTranslateButton, 200);
const debouncedAddTranslateButtonToAllMessages = debounce(
  addTranslateButtonToAllMessages,
  200
);

window.addEventListener("load", () => {
  renderTranslateButton();
  observeChatChanges();
});
