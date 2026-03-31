// Get DOM elements
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const tweetBtn = document.getElementById('tweet-quote');
const saveBtn = document.getElementById('save-quote');
const favoritesList = document.getElementById('favorites');
const categorySelect = document.getElementById('category');

// Current quote
let currentQuote = { content: '', author: '' };

// Favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Fallback quotes in case API fails
const fallbackQuotes = [
  { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { content: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" }
];

// Fetch a quote (API or fallback)
async function getQuote() {
  try {
    let url = 'https://api.quotable.io/random';
    const category = categorySelect.value;
    if (category) url += `?tags=${category}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("API fetch failed");

    const data = await response.json();
    quoteText.textContent = `"${data.content}"`;
    quoteAuthor.textContent = `- ${data.author}`;
    currentQuote = { content: data.content, author: data.author };
  } catch (error) {
    // Pick random fallback quote
    const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    quoteText.textContent = `"${random.content}"`;
    quoteAuthor.textContent = `- ${random.author}`;
    currentQuote = { content: random.content, author: random.author };
    console.warn("API failed, using fallback quote.");
  }
}

// Tweet quote
function tweetQuote() {
  if (!currentQuote.content) return;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${currentQuote.content}" - ${currentQuote.author}`
  )}`;
  window.open(url, "_blank");
}

// Save favorite
function saveQuote() {
  if (!currentQuote.content) return;
  if (favorites.some(q => q.content === currentQuote.content)) {
    alert("Quote already in favorites!");
    return;
  }
  favorites.push(currentQuote);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

// Delete favorite
function deleteFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

// Render favorites
function renderFavorites() {
  favoritesList.innerHTML = '';
  favorites.forEach((q, index) => {
    const li = document.createElement('li');
    li.innerHTML = `"${q.content}" - ${q.author} <button onclick="deleteFavorite(${index})">Delete</button>`;
    favoritesList.appendChild(li);
  });
}

// Event listeners
newQuoteBtn.addEventListener('click', getQuote);
tweetBtn.addEventListener('click', tweetQuote);
saveBtn.addEventListener('click', saveQuote);
categorySelect.addEventListener('change', getQuote);

// Initial load
getQuote();
renderFavorites();