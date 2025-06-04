const newWordBtn = document.querySelector('#new_word');
const inputNewWord = document.querySelector('#word');
const submitBtn = document.querySelector('#send');
const inputSection = document.querySelector('.form-section');
const outScreen = document.querySelector('.uotwidth');

newWordBtn.addEventListener('click', () => {
    inputSection.style.display = 'block';
});

function getSavedWords() {
    const saved = localStorage.getItem('savedWords');
    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveWords(words) {
    localStorage.setItem('savedWords', JSON.stringify(words));
}

function updateOutScreen(words) {
    outScreen.innerHTML = `
    <ul class="list-disc pl-4">
      ${words.map(obj => {
        const key = Object.keys(obj)[0];
        const value = obj[key];
        return `<li><strong>${key}</strong>:  ${value}</li>
        <hr>`;
    }).join('')}
    </ul>
  `;
}

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const rawInput = inputNewWord.value.trim();
    if (!rawInput) return;

    //  Парс:  по `/`
    const parts = rawInput.split('/');
    if (parts.length < 2) {
        alert('Формат має бути: слово /транскрипція/ переклад');
        return;
    }

    const word = parts[0].trim().toLowerCase(); // Слово до слеша
    const translation = parts[2]?.trim() || parts[1].trim(); //  після другого або першого слеша

    if (!word || !translation) {
        alert('Не вдалося виділити слово або переклад.');
        return;
    }

    const words = getSavedWords();

    // Перевірка на повтор
    const isDuplicate = words.some(obj => Object.keys(obj)[0] === word);
    if (isDuplicate) {
        alert('Це слово вже додано!');
        return;
    }

    const newEntry = {};
    newEntry[word] = translation;
    words.push(newEntry);
    saveWords(words);
    updateOutScreen(words);
    inputNewWord.value = '';
});

window.addEventListener('DOMContentLoaded', () => {
    const words = getSavedWords();
    updateOutScreen(words);
});
