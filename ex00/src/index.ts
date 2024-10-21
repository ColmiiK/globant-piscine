const imageElement = document.getElementById("image") as HTMLImageElement;
const loadButton = document.getElementById("load-button") as HTMLButtonElement;

async function loadImage(): Promise<void> {
  try {
    const response = await fetch("http://localhost:5000/api/random-image");
    const data = await response.json();
    console.log("API response:", data);
    const imageUrl: string = data.imageUrl;

    // Check if the image URL exists
    if (!imageUrl) {
      throw new Error("Image URL is missing in the response");
    }

    // Set the image source to the URL fetched from your backend
    imageElement.src = imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

// Load a new image when the page loads
window.onload = loadImage;

// Load a new image when the button is clicked
loadButton.addEventListener("click", loadImage);
