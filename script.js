const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const passwordOutput = document.getElementById("passwordOutput");
const copyButton = document.getElementById("copyButton");
const copyStatus = document.getElementById("copyStatus");
const strengthLabel = document.getElementById("strengthLabel");
const strengthBar = document.getElementById("strengthBar");
const entropyText = document.getElementById("entropyText");
const generateButton = document.getElementById("generateButton");
const generatorError = document.getElementById("generatorError");
const excludeAmbiguous = document.getElementById("excludeAmbiguous");

const optionInputs = {
  uppercase: document.getElementById("uppercase"),
  lowercase: document.getElementById("lowercase"),
  numbers: document.getElementById("numbers"),
  symbols: document.getElementById("symbols"),
};

const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/~",
};

const ambiguousCharacters = new Set(["O", "0", "I", "l", "1", "|", "`", "'"]);

function secureRandomIndex(max) {
  if (!Number.isInteger(max) || max <= 0) {
    throw new Error("Random range must be a positive integer.");
  }

  const maxUint32 = 0x100000000;
  const rejectionLimit = Math.floor(maxUint32 / max) * max;
  const randomBuffer = new Uint32Array(1);

  let randomNumber;
  do {
    crypto.getRandomValues(randomBuffer);
    randomNumber = randomBuffer[0];
  } while (randomNumber >= rejectionLimit);

  return randomNumber % max;
}

function randomCharacter(pool) {
  return pool[secureRandomIndex(pool.length)];
}

function shuffleSecurely(characters) {
  const result = [...characters];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomIndex(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result.join("");
}

function getSelectedSets() {
  return Object.entries(optionInputs)
    .filter(([, input]) => input.checked)
    .map(([name]) => {
      const rawSet = characterSets[name];

      if (!excludeAmbiguous.checked) {
        return rawSet;
      }

      return [...rawSet].filter((character) => !ambiguousCharacters.has(character)).join("");
    })
    .filter(Boolean);
}

function getPoolSize(selectedSets) {
  return selectedSets.reduce((total, set) => total + set.length, 0);
}

function updateStrength(passwordLength, poolSize) {
  const entropy = poolSize > 1 ? passwordLength * Math.log2(poolSize) : 0;
  let label = "Weak";
  let width = 24;
  let barColor = "#fb7185";

  if (entropy >= 80) {
    label = "Very strong";
    width = 100;
    barColor = "#5eead4";
  } else if (entropy >= 60) {
    label = "Strong";
    width = 76;
    barColor = "#4ade80";
  } else if (entropy >= 40) {
    label = "Fair";
    width = 52;
    barColor = "#fbbf24";
  }

  strengthLabel.textContent = label;
  strengthBar.style.width = `${width}%`;
  strengthBar.style.background = barColor;
  entropyText.textContent = poolSize
    ? `Estimated entropy: ${Math.round(entropy)} bits`
    : "Select at least one character set.";
}

function generatePassword() {
  const selectedSets = getSelectedSets();
  const passwordLength = Number(lengthSlider.value);
  const poolSize = getPoolSize(selectedSets);

  generatorError.textContent = "";
  copyStatus.textContent = "";

  if (!selectedSets.length) {
    passwordOutput.value = "";
    generatorError.textContent = "Choose at least one character set.";
    updateStrength(passwordLength, 0);
    return;
  }

  const pool = selectedSets.join("");
  const requiredCharacters = selectedSets.map(randomCharacter);
  const generatedCharacters = [...requiredCharacters];

  while (generatedCharacters.length < passwordLength) {
    generatedCharacters.push(randomCharacter(pool));
  }

  passwordOutput.value = shuffleSecurely(generatedCharacters).slice(0, passwordLength);
  updateStrength(passwordLength, poolSize);
}

async function copyPassword() {
  if (!passwordOutput.value) {
    generatePassword();
  }

  if (!passwordOutput.value) {
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(passwordOutput.value);
    } else {
      passwordOutput.focus();
      passwordOutput.select();
      document.execCommand("copy");
      passwordOutput.setSelectionRange(0, 0);
      passwordOutput.blur();
    }

    copyStatus.textContent = "Copied to clipboard.";
    copyButton.setAttribute("aria-label", "Password copied");
  } catch {
    copyStatus.textContent = "Copy failed. Select the password and copy it manually.";
  }

  window.setTimeout(() => {
    copyStatus.textContent = "";
    copyButton.setAttribute("aria-label", "Copy password");
  }, 1800);
}

function updateLengthUI() {
  const min = Number(lengthSlider.min);
  const max = Number(lengthSlider.max);
  const value = Number(lengthSlider.value);
  const progress = ((value - min) / (max - min)) * 100;

  lengthValue.textContent = value;
  lengthSlider.setAttribute("aria-valuenow", String(value));
  lengthSlider.style.setProperty("--range-progress", `${progress}%`);
  generatePassword();
}

lengthSlider.addEventListener("input", updateLengthUI);
generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);
excludeAmbiguous.addEventListener("change", generatePassword);

Object.values(optionInputs).forEach((input) => {
  input.addEventListener("change", generatePassword);
});

updateLengthUI();
