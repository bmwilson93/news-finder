const API_KEY = '';

let currentPage = 1;
let currentCategory = null;
let currentKeyword = null;
let isLoading = false;
let lastArticleCount = 0;

const fetchNews = async (isSearching) => {
  if (isLoading) return;

  isLoading = true;
  let url;
  // if user is searching by keyword
  if (isSearching) {
    const keyword = document.getElementById('searchKeyword').value;
    url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}&page=${currentPage}`;
  } else { // user is searching by category
    const category = currentCategory || document.getElementById('category').value;
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}&page=${currentPage}`;
  }

  // get the news data
  try {
    const response = await fetch(url);
    const data = await response.json();

    const newsContainer = document.getElementById('newsContainer');
    if (currentPage === 1){
      newsContainer.html = '';
    }

    // filter to only have articles that include an image
    const articlesWithImage = data.articles.filter(article => article.urlToImage);

    if (articlesWithImage.length === 0 || articlesWithImage.length === lastArticleCount) {
      displayNoMoreNews();
      return;
    }

    lastArticleCount = articlesWithImage.length;

    // add a news item to the newsContainer for each article
    articlesWithImage.forEach(article => {
      const newsItem = `
        <div class="newsItem">

          <div class="newsImage">
            <img src="${article.urlToImage}"
            alt="${article.title}" />
          </div>

          <div class="newsContent">
            <div class="info">
              <h5>${article.source.name}</h5>
              <span>|</span>
              <h5>${article.publishedAt}</h5>
            </div>

            <h2>${article.title}</h2>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read More</a>

          </div>

        </div>
      `;
      newsContainer.innerHTML += newsItem;
    });

    currentPage++;
    isLoading = false;

  } catch (error) {
    console.error("There was an error with getting the news data!", error);
    isLoading = false;
  }
}

const displayNoMoreNews = () => {
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML += '<p>No more news to load...</p>';
}

// Loads more news as the user scrolls
window.onscroll = () => {
  if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
    if (currentKeyword){
      fetchNews(true);
    } else {
      fetchNews(false);
    }
  }
}

// Event listeners
document.getElementById('searchKeyword').addEventListener('input', () => {
  currentPage = 1;
  currentCategory = null;
  currentKeyword = this.value;
});

document.getElementById('fetchCategory').addEventListener('click', () => {
  currentPage = 1;
  currentKeyword = null;
  fetchNews(false);
});

document.getElementById('fetchKey').addEventListener('click', () => fetchNews(true));