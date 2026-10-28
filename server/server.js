require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const supplierRoutes = require("./routes/supplierRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Supplier Management API is running"
  });
});

app.use("/api/suppliers", supplierRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handler must come after the routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();