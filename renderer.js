const { ipcRenderer, clipboard } = require('electron');

const englishInput = document.getElementById('english-input');
const binaryOutput = document.getElementById('binary-output');
const copyBtn = document.getElementById('copy-btn');
const closeBtn = document.getElementById('close-btn');
const minBtn = document.getElementById('min-btn');
const copyStatus = document.getElementById('copy-status');

closeBtn.addEventListener('click', () => {
  ipcRenderer.send('quit-app');
});

minBtn.addEventListener('click', () => {
  ipcRenderer.send('close-window');
});

function textToBinary(text) {
  return Array.from(text)
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

function binaryToText(binary) {
  return binary
    .split(/\s+/)
    .filter(bin => bin.length > 0 && /^[01]+$/.test(bin))
    .map(bin => String.fromCharCode(parseInt(bin, 2)))
    .join('');
}

let isEnglishInputting = false;
let isBinaryInputting = false;

englishInput.addEventListener('input', (e) => {
  if (isBinaryInputting) return;
  isEnglishInputting = true;
  const text = e.target.value;
  binaryOutput.value = textToBinary(text);
  isEnglishInputting = false;
});

binaryOutput.addEventListener('input', (e) => {
  if (isEnglishInputting) return;
  isBinaryInputting = true;
  const binary = e.target.value;
  englishInput.value = binaryToText(binary);
  isBinaryInputting = false;
});

copyBtn.addEventListener('click', () => {
  const binaryText = binaryOutput.value;
  if (binaryText) {
    clipboard.writeText(binaryText);

    copyStatus.style.opacity = '1';
    setTimeout(() => {
      copyStatus.style.opacity = '0';
    }, 2000);
  }
});
