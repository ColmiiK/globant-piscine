const imageContainer = document.getElementById(
  "image-container",
) as HTMLImageElement;
const loadButton = document.getElementById("load-button") as HTMLButtonElement;
const queryInput = document.getElementById("query") as HTMLInputElement;
const authInput = document.getElementById("auth") as HTMLInputElement;

async function loadImage(): Promise<void> {
  const query = queryInput.value;
  try {
    const response = await fetch(
      `http://localhost:5000/api/random-image?query=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    console.log("API response:", data);
    const imageUrls: string[] = data.imageUrls;

    imageContainer.innerHTML = "";

    imageUrls.forEach((url) => {
      const imageElement = document.createElement("img");
      imageElement.src = url;
      imageContainer.appendChild(imageElement);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

async function loadImageRandom(): Promise<void> {
  try {
    const response = await fetch(`http://localhost:5000/api/random-image`);
    const data = await response.json();
    console.log("API response:", data);
    const imageUrls: string[] = data.imageUrls;
    imageContainer.innerHTML = "";

    imageUrls.forEach((url) => {
      const imageElement = document.createElement("img");
      imageElement.src = url;
      imageContainer.appendChild(imageElement);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

function redirectToOAuth() {
  const clientId = authInput.value;
  const redirectUri = "http://localhost:5000/auth/callback";
  const scope = "public";

  const authUrl = `https://unsplash.com/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
  window.location.href = authUrl;
}

window.onload = loadImageRandom;

loadButton.addEventListener("click", loadImageRandom);
queryInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    loadImage(); // Trigger the image load function
  }
});
authInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    redirectToOAuth();
  }
});
