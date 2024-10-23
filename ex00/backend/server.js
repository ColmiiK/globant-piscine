const cors = require("cors");
const express = require("express");
const axios = require("axios");
const app = express();
const port = 5000;
require("dotenv").config();
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

app.use(
  cors({
    origin: "http://localhost:8080", // Allow frontend on localhost:8080
    methods: ["GET", "POST"],
  }),
);

// Consume the Unsplash API to get photos
app.get("/api/image", async (req, res) => {
  const query = req.query.query;
  const imageCount = 99;
  try {
    let response;
    let images;
    if (query) {
      response = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query,
          client_id: UNSPLASH_API_KEY,
          per_page: imageCount,
        },
      });

      images = response.data.results;
    } else {
      response = await axios.get("https://api.unsplash.com/photos/random", {
        params: {
          count: imageCount,
          client_id: UNSPLASH_API_KEY,
        },
      });
      images = response.data;
    }
    if (images && images.length > 0) {
      const imageUrls = images.map((image) => image.urls.small);
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
