const express = require("express");
const { authentication, login } = require("./services/authService");
const childrenRoutes = require("./routes/children.routes");
const authRoutes = require("./routes/auth.routes");

function createApp() {
  const app = express();
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