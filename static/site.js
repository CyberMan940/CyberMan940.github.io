const requestStorageKey = "cyberman-build-requests";
const isGithubPages = window.location.hostname.endsWith("github.io");

function getStoredRequests() {
    try {
        return JSON.parse(localStorage.getItem(requestStorageKey) || "[]");
    } catch (error) {
        return [];
    }
}

function saveStoredRequests(requests) {
    localStorage.setItem(requestStorageKey, JSON.stringify(requests));
}

function setupGithubForm() {
    const form = document.querySelector("#request-form");
    if (!form || !isGithubPages) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const idea = String(formData.get("idea") || "").trim();
        const description = String(formData.get("description") || "").trim();

        if (!idea) {
            return;
        }

        const requests = getStoredRequests();
        requests.push({
            id: requests.length + 1,
            idea,
            description,
            status: "RECEIVED",
            date: new Date().toLocaleString()
        });
        saveStoredRequests(requests);
        window.location.href = "success.html";
    });
}

function setupGithubRequestsPage() {
    const requestList = document.querySelector("#github-request-list");
    if (!requestList || !isGithubPages) {
        return;
    }

    const requests = getStoredRequests();
    const count = document.querySelector("#github-request-count");
    if (count) {
        count.textContent = requests.length;
    }

    if (!requests.length) {
        requestList.innerHTML = '<p class="empty-requests">NO BUILD REQUESTS RECEIVED YET.</p>';
        return;
    }

    requestList.replaceChildren(...requests.map((item) => {
        const card = document.createElement("article");
        card.className = "request-card";
        card.innerHTML = `
            <div class="request-top">
                <span class="request-number">REQUEST_${item.id}</span>
                <span class="request-status">${item.status}</span>
            </div>
            <div class="request-content">
                <p class="request-label">PROJECT IDEA</p>
                <h2></h2>
                <p class="description"></p>
            </div>
            <div class="request-footer">
                <span>CYBERMAN // INCOMING</span>
                <span></span>
            </div>`;
        card.querySelector("h2").textContent = item.idea;
        card.querySelector(".description").textContent = item.description || "No description provided.";
        card.querySelector(".request-footer span:last-child").textContent = item.date;
        return card;
    }));
}

function setupGithubLinks() {
    if (!isGithubPages) {
        return;
    }

    document.querySelectorAll('a[href="/requests"]').forEach((link) => {
        link.href = "requests.html";
    });
}

setupGithubForm();
setupGithubRequestsPage();
setupGithubLinks();
