const APIURL = "https://api.github.com/users/";
const searchButton = document.getElementById("search1");
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const increasePerPageButton = document.getElementById("increasePerPage");

let repositoriesPerPage = 10;

increasePerPageButton.addEventListener("click", () => {
  repositoriesPerPage += 10;
  getUser(search.value);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;

  if (user) {
    getUser(user);
  }
});

searchButton.addEventListener("click", () => {
  const user = search.value.trim();

  if (user) {
    getUser(user);
  }
});

async function getUser(username) {
  try {
    const response = await fetch(APIURL + username);
    if (response.ok) {
      const data = await response.json();
      createUserCard(data);
      getRepos(username, repositoriesPerPage);
    } else {
      createErrorCard("No profile with this Username");
    }
  } catch (err) {
    createErrorCard("An error occurred. Please try again later.");
  }
}

async function getRepos(username, perPage = 10) {
  try {
    const response = await fetch(
      `${APIURL}${username}/repos?sort=created&per_page=${perPage}`
    );
    if (response.ok) {
      const data = await response.json();
      clearRepoCards();
      createRepoCards(data);
    } else {
      createErrorCard("Problem Fetching Repos");
    }
  } catch (err) {
    createErrorCard("Problem Fetching Repos");
  }
}

function createUserCard(user) {
  const searchedUsername = search.value;
  const username = user.name || searchedUsername || "Unknown User";

  const locationHTML = user.location
    ? `<p>
         <img src="/img/Location.png" alt="Location" width="20" height="20">
         ${user.location}
       </p>`
    : "";

  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url || ""}" alt="${username}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${username}</h2>
        <p>${user.public_repos} <strong>Repositories</strong></p>
        <p>${user.bio || ""}</p>
        ${locationHTML}
        <a href="${user.html_url}" target="_blank">
          <img src="/img/Link.png" alt="GitHub" width="20" height="20">
          ${user.html_url || "No GitHub URL available"}
        </a>
      </div>
    </div>
  `;
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>
  `;
  main.innerHTML = cardHTML;
}

function createRepoCards(repos) {
  const repoContainer = document.createElement("div");
  repoContainer.classList.add("repo-container");

  repos.slice(0, repositoriesPerPage).forEach((repo) => {
    const repoCard = document.createElement("div");
    repoCard.classList.add("repo-card");

    const repoHTML = `
      <div class="repo-info">
        <h3>${repo.name}</h3>
        <span class="technologies"> ${repo.language || "Not specified"}</span>
      </div>
    `;

    repoCard.innerHTML = repoHTML;
    repoContainer.appendChild(repoCard);
  });

  main.appendChild(repoContainer);
}

function clearRepoCards() {
  const repoContainer = document.querySelector(".repo-container");
  if (repoContainer) {
    repoContainer.remove();
  }
}
