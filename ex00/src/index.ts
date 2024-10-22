const imageContainer = document.getElementById(
  "image-container",
) as HTMLImageElement;
const loadButton = document.getElementById("load-button") as HTMLButtonElement;
const queryInput = document.getElementById("query") as HTMLInputElement;
const authInput = document.getElementById("auth") as HTMLInputElement;

// Adds the images to the DOM
function addImages(imageUrls: string[]) {
  imageContainer.innerHTML = "";
  imageUrls.forEach((url) => {
    const imageElement = document.createElement("img");
    imageElement.src = url;
    imageContainer.appendChild(imageElement);
  });
}

// Parses response as json
async function handleResponse(response: any) {
  const data = await response.json();
  console.log("API response:", data);
  const imageUrls: string[] = data.imageUrls;
  addImages(imageUrls);
}

// Load images from a query
async function loadImage(): Promise<void> {
  const query = queryInput.value;
  try {
    const response = await fetch(
      `http://localhost:5000/api/image?query=${encodeURIComponent(query)}`,
    );
    await handleResponse(response);
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

// Load random images with no query
async function loadImageRandom(): Promise<void> {
  try {
    const response = await fetch(`http://localhost:5000/api/image`);
    await handleResponse(response);
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

loadButton.addEventListener("click", loadImageRandom);
queryInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    loadImage(); // Trigger the image load function
  }
});
authInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
  }
});

window.onload = loadImageRandom;
