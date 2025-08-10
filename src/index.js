require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./database/connectMongoDB.js");

// Routes
const authRoutes = require("./routes/authRoutes.js");
const questionsRoutes = require("./routes/questionsRoutes.js");
const apiLogger = require("./middlewares/apiLogger.js");

const app = express();
  
// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// connect to database
connectDB();

app.use(apiLogger)
// main API
app.get("/", (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "API is working perfectly",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
});

// Routs
app.use("/auth", authRoutes);
app.use("/questions", questionsRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
 