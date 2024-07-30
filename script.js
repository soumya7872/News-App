const apiKey = "pub_495250e766ffd37ba15d8535d1db29d8874ef";
const baseUrl = "https://newsdata.io/api/1/latest";

window.addEventListener('load', () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const url = `${baseUrl}?apikey=${apiKey}&q=${query}&country=in`;
        const res = await fetch(url);
        if (!res.ok) {
            if (res.status === 429) {
                console.error("API rate limit exceeded. Please try again later.");
                return;
            } else {
                throw new Error('Network response was not ok');
            }
        }
        const data = await res.json();
        console.log(data); // Log the entire response to check its structure
        bindData(data.results);
    } catch (error) {
        console.error("Fetching news failed:", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');
    cardsContainer.innerHTML = '';

    if (!articles || !Array.isArray(articles)) return;

    articles.forEach(article => {
        if (!article.image_url) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.image_url;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.pubDate).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });

    newsSource.innerHTML = `${article.source_id} : ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.link, "_blank");
    });
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }
    curSelectedNav = navItem;
    curSelectedNav?.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }
    curSelectedNav = null;
});
