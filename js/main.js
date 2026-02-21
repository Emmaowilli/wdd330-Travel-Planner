// main.js

// Home page search
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');

// Details page elements
const countryName = document.getElementById('country-name');
const detailsDiv = document.getElementById('details');
const saveBtn = document.getElementById('save-btn');

// Function to search countries (home page only)
async function searchCountries(query) {
  if (!resultsDiv) return; // not on home page

  resultsDiv.innerHTML = '';

  if (query.length < 2) {
    resultsDiv.innerHTML = '<p>Start typing a country name...</p>';
    return;
  }

  resultsDiv.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);

    if (!response.ok) throw new Error('No countries found');

    const countries = await response.json();

    resultsDiv.innerHTML = countries.map(country => `
      <div class="card" onclick="window.location.href='details.html?code=${country.cca3}'">
        <img src="${country.flags.png}" alt="${country.name.common}" width="120" />
        <h2>${country.name.common}</h2>
        <p>Capital: ${country.capital?.[0] || 'N/A'}</p>
        <p>Population: ${country.population.toLocaleString()}</p>
      </div>
    `).join('');
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

// Live search (home page)
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    searchCountries(query);
  });
}

// Search button click (home page)
if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      searchCountries(query);
    } else {
      resultsDiv.innerHTML = '<p>Please type a country name.</p>';
    }
  });
}

// Details page: load country and save favorite
if (countryName && detailsDiv && saveBtn) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then(res => res.json())
      .then(([country]) => {
        countryName.textContent = country.name.common;

        detailsDiv.innerHTML = `
          <img src="${country.flags.png}" alt="${country.name.common}" width="240" />
          <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Currency:</strong> ${Object.values(country.currencies || {})[0]?.name || 'N/A'}</p>
          <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ') || 'N/A'}</p>
          <p><strong>Region:</strong> ${country.region}</p>
        `;

        // Save to favorites
        saveBtn.addEventListener('click', () => {
          let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

          // Check if already saved
          if (favorites.some(fav => fav.code === code)) {
            alert('Already saved!');
            return;
          }

          favorites.push({
            code: code,
            name: country.name.common,
            flag: country.flags.png
          });

          localStorage.setItem('favorites', JSON.stringify(favorites));
          alert('Saved to favorites!');
        });
      })
      .catch(() => {
        detailsDiv.innerHTML = '<p style="color: red;">Country not found</p>';
      });
  }
}
function showFavorites() {
  const favDiv = document.getElementById('favorites');
  if (!favDiv) return;

  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  if (favorites.length === 0) {
    favDiv.innerHTML = '<p>No favorites saved yet.</p>';
    return;
  }

  favDiv.innerHTML = favorites.map(fav => `
    <div class="card">
      <img src="${fav.flag}" alt="${fav.name}" width="120" />
      <h2>${fav.name}</h2>
    </div>
  `).join('');
}

showFavorites();