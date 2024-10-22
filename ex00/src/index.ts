const imageContainer = document.getElementById(
  "image-container",
) as HTMLImageElement;
const loadButton = document.getElementById("load-button") as HTMLButtonElement;
const queryInput = document.getElementById("query") as HTMLInputElement;

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

window.onload = loadImage;

loadButton.addEventListener("click", loadImage);
queryInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    loadImage(); // Trigger the image load function
  }
});
