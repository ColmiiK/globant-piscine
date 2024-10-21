const cors = require("cors");
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 5000;
app.use(
  cors({
    origin: "http://localhost:8080", // Allow frontend on localhost:8080
    methods: ["GET", "POST"],
  }),
);
// Retrieve Unsplash API key from environment variables
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

app.get("/api/random-image", async (req, res) => {
  try {
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
      },
    });

    // Log the response data for debugging

    const image = response.data; // Get the first image
    if (image) {
      // Send the image URL back to the frontend
      res.json({ imageUrl: image.urls.regular });
    } else {
      res.status(500).json({ error: "No image found" });
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image from Unsplash" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
