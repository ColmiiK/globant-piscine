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
// https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}
app.get("/api/random-image", async (req, res) => {
  const query = req.query.query || "random";
  const imageCount = 4;
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        client_id: UNSPLASH_API_KEY,
        per_page: imageCount,
      },
    });

    const images = response.data.results;
    if (images && images.length > 0) {
      const imageUrls = images.map((image) => image.urls.regular);
      res.json({ imageUrls });
    } else {
      res.status(500).json({ error: "No images found" });
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image from Unsplash" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
