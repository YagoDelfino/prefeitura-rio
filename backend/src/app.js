const express = require("express");

function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use((_request, response) => {
    response.status(404).json({ message: "Route not found" });
  });

  return app;
}

module.exports = {
  createApp,
};