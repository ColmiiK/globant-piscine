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
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
app.get("/api/random-image", async (req, res) => {
  const query = req.query.query;
  const imageCount = 4;

  try {
    let response;
    if (query) {
      response = await axios.get("https://api.unsplash.com/search/photos", {
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
    } else {
      response = await axios.get("https://api.unsplash.com/photos/random", {
        params: {
          count: imageCount,
          client_id: UNSPLASH_API_KEY,
        },
      });
      const images = response.data;
      if (images && images.length > 0) {
        const imageUrls = images.map((image) => image.urls.regular);
        res.json({ imageUrls });
      } else {
        res.status(500).json({ error: "No random images found" });
      }
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image from Unsplash" });
  }
});

async function exchangeCodeForToken(code) {
  const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
  const UNSPLASH_SECRET = process.env.UNSPLASH_SECRET;
  const REDIRECT_URI = "http://localhost:5000/auth/callback";
  try {
    const response = await axios.post(
      "https://unsplash.com/oauth/token",
      null,
      {
        params: {
          client_id: UNSPLASH_API_KEY,
          client_secret: UNSPLASH_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code,
          grant_type: "authorization_code",
        },
      },
    );
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response.data,
    );
    throw new Error("Failed to obtain access token");
  }
}

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const accessToken = await exchangeCodeForToken(code);
    res.send("Authentification successful! Feel free to close this window");
  } catch (error) {
    res.status(500).send("Error exchanging code for access token");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
