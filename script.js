document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("nav ul li a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetPage = this.getAttribute("href");
      if (targetPage === "index.html" || targetPage === "/") {
        // Redirect to home page
        window.location.href = targetPage;
      } else {
        loadPage(targetPage);
      }
    });
  });

  function loadPage(url) {
    showLoadingIndicator(); // Show loading indicator
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((data) => {
        const newDocument = new DOMParser().parseFromString(data, "text/html");
        const newMainContent = newDocument.querySelector("main").innerHTML;
        if (newMainContent) {
          document.querySelector("main").innerHTML = newMainContent;
          document.querySelector("header").innerHTML =
            newDocument.querySelector("header").innerHTML; // Update header if necessary
          window.history.pushState(null, null, url);
        } else {
          console.error("No main content found in the fetched page.");
          document.querySelector("main").innerHTML =
            "<p>Oops! Something went wrong.</p>";
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        document.querySelector("main").innerHTML =
          "<p>Oops! Something went wrong.</p>";
      })
      .finally(() => {
        hideLoadingIndicator(); // Hide loading indicator
      });
  }

  function showLoadingIndicator() {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loading-indicator";
    loadingIndicator.textContent = "Loading...";
    loadingIndicator.style.position = "fixed";
    loadingIndicator.style.top = "50%";
    loadingIndicator.style.left = "50%";
    loadingIndicator.style.transform = "translate(-50%, -50%)";
    loadingIndicator.style.backgroundColor = "#333";
    loadingIndicator.style.color = "#fff";
    loadingIndicator.style.padding = "1rem 2rem";
    loadingIndicator.style.borderRadius = "5px";
    loadingIndicator.style.zIndex = "1000";
    document.body.appendChild(loadingIndicator);
  }

  function hideLoadingIndicator() {
    const indicator = document.getElementById("loading-indicator");
    if (indicator) {
      indicator.remove();
    }
  }

  window.addEventListener("popstate", function () {
    const path = window.location.pathname;
    loadPage(path);
  });
});
