let quotes = [
  {
    text: "תחייך, זה מדבק",
    author: "לא ידוע",
    category: "שמחה",
  },
  {
    text: "החיים הם לא מה שקורה לך, אלא איך אתה מגיב למה שקורה",
    author: "וירג'יניה סאטיר",
    category: "השראה",
  },
  {
    text: "כל יום הוא הזדמנות חדשה",
    author: "לא ידוע",
    category: "מוטיבציה",
  },
]; // משפטים ברירת מחדל במקרה שהטעינה נכשלת

let currentQuote = "";
let currentCategory = "all";

const categoryEmojis = {
  השראה: "✨",
  מוטיבציה: "💪",
  "הגשמה עצמית": "🎯",
  הצלחה: "🏆",
  צמיחה: "🌱",
  אתגר: "🎮",
  שמחה: "😊",
  אהבה: "❤️",
  חוכמה: "🧠",
  מנהיגות: "👑",
  חברות: "🤝",
  משפחה: "👨‍👩‍👧‍👦",
  לימודים: "📚",
  זמן: "⏰",
  שלום: "🕊️",
  טבע: "🌿",
  יהדות: "✡️",
  all: "🌟",
  "חוכמת חיים": "🌱",
};

async function loadQuotes() {
  try {
    const response = await fetch("quotes.json");
    if (!response.ok) throw new Error("בעיה בטעינת הקובץ");
    const data = await response.json();
    if (data.quotes && data.quotes.length > 0) {
      quotes = data.quotes;
      updateStats();
    }
  } catch (error) {
    console.warn("משתמש במשפטי ברירת מחדל:", error);
  } finally {
    setupCategories();
    displayNewQuote();
    displayAllQuotes();
  }
}

function setupCategories() {
  const categories = ["all", ...new Set(quotes.map((quote) => quote.category))];
  const categoryList = document.getElementById("categoryList");

  categories.forEach((category) => {
    const li = document.createElement("li");
    li.className = `category-item ${
      category === currentCategory ? "active" : ""
    }`;
    li.innerHTML = `
            <span class="category-emoji">${
              categoryEmojis[category] || "📌"
            }</span>
            <span>${category === "all" ? "הכל" : category}</span>
        `;
    li.onclick = () => {
      currentCategory = category;
      updateActiveCategory();
      displayNewQuote();
    };
    categoryList.appendChild(li);
  });
}

function updateActiveCategory() {
  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.remove("active");
    if (
      item.textContent.includes(
        currentCategory === "all" ? "הכל" : currentCategory
      )
    ) {
      item.classList.add("active");
    }
  });
}

function displayAllQuotes() {
  const quotesGrid = document.getElementById("quotesGrid");
  quotesGrid.innerHTML = "";

  document.getElementById("searchQuotes").value = "";

  quotes.forEach((quote) => {
    const quoteCard = document.createElement("div");
    quoteCard.className = "quote-card fade-in";
    quoteCard.innerHTML = `
            <p class="quote-text">${quote.text}</p>
            <p class="author">- ${quote.author || "לא ידוע"}</p>
            <span class="category-tag">
                ${categoryEmojis[quote.category] || "📌"} ${quote.category}
            </span>
        `;
    quotesGrid.appendChild(quoteCard);
  });
}

function toggleQuotesList() {
  const quotesListContainer = document.getElementById("quotesList");
  quotesListContainer.classList.toggle("hidden");
}

function getRandomQuote(category = "all") {
  let filteredQuotes = quotes;
  if (category !== "all") {
    filteredQuotes = quotes.filter((quote) => quote.category === category);
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex];
}

function displayNewQuote() {
  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");
  const categoryElement = document.getElementById("quoteCategory");

  quoteElement.classList.remove("fade-in");
  void quoteElement.offsetWidth;

  const quote = getRandomQuote(currentCategory);
  currentQuote = quote;

  quoteElement.classList.add("fade-in");
  quoteElement.textContent = quote.text;
  authorElement.textContent = quote.author ? `- ${quote.author}` : "";

  categoryElement.innerHTML = `
    <span class="category-emoji">${
      categoryEmojis[quote.category] || "📌"
    }</span>
    ${quote.category}
  `;
}

function copyQuote() {
  const textToCopy = `${currentQuote.text}\n- ${
    currentQuote.author || "לא ידוע"
  }`;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert("המשפט הועתק בהצלחה!");
    })
    .catch((err) => {
      console.error("שגיאה בהעתקה:", err);
    });
}

function shareQuote() {
  if (navigator.share) {
    navigator
      .share({
        title: "משפט לחיים",
        text: `${currentQuote.text}\n- ${currentQuote.author || "לא ידוע"}`,
        url: window.location.href,
      })
      .catch(console.error);
  } else {
    copyQuote();
  }
}

function updateStats() {
  const uniqueAuthors = new Set(quotes.map((quote) => quote.author)).size;
  const uniqueCategories = new Set(quotes.map((quote) => quote.category)).size;
  const totalQuotes = quotes.length;

  document.querySelectorAll(".stat-number").forEach((stat, index) => {
    const numbers = [uniqueAuthors, uniqueCategories, totalQuotes];
    stat.textContent = numbers[index];
  });
}

// אתחול
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();

  document
    .getElementById("newQuote")
    .addEventListener("click", displayNewQuote);
  document.getElementById("copyQuote").addEventListener("click", copyQuote);
  document.getElementById("shareQuote").addEventListener("click", shareQuote);
  document
    .getElementById("toggleList")
    .addEventListener("click", toggleQuotesList);

  document
    .getElementById("searchQuotes")
    .addEventListener("input", handleSearch);
});

function handleSearch(event) {
  const searchTerm = event.target.value.trim().toLowerCase();
  const quotesGrid = document.getElementById("quotesGrid");
  const quoteCards = quotesGrid.getElementsByClassName("quote-card");

  Array.from(quoteCards).forEach((card) => {
    const quoteText = card
      .querySelector(".quote-text")
      .textContent.toLowerCase();
    const author = card.querySelector(".author").textContent.toLowerCase();
    const category = card
      .querySelector(".category-tag")
      .textContent.toLowerCase();

    const matches =
      quoteText.includes(searchTerm) ||
      author.includes(searchTerm) ||
      category.includes(searchTerm);

    card.style.display = matches ? "" : "none";

    if (matches) {
      card.classList.add("fade-in");
    } else {
      card.classList.remove("fade-in");
    }
  });
}
