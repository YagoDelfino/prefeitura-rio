const express = require("express");
const cors = require("cors");
const childrenRoutes = require("./routes/children.routes");
const authRoutes = require("./routes/auth.routes");

function createApp() {
  const app = express();
  const allowedOrigins = (
    process.env.FRONTEND_URL
  )

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());

  app.use("/auth", authRoutes);
  app.use("/api/children", childrenRoutes);
  
  app.use((_request, response) => {
    response.status(404).json({ message: "Route not found" });
  });

  return app;
}

module.exports = {
  createApp,
};