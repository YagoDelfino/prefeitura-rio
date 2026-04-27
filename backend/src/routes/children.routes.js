const express = require("express");
const router = express.Router();

const {
  getChildren,
  getChildById,
  reviewChild,
  getChildrenSummary,
} = require("../services/childService");

const { authentication } = require("../services/authService");

router.get("/", (req, res) => {
  const result = getChildren(req.query);
  res.json(result);
});

router.get("/summary", (req, res) => {
  const summary = getChildrenSummary();
  return res.json(summary);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const child = getChildById(id);

  if (!child) {
    return res.status(404).json({ message: "Criança não encontrada" });
  }

  return res.json(child);
});

router.patch("/:id/review", authentication, (req, res) => {
  const { id } = req.params;
  const { revisado } = req.body;

  const child = getChildById(id);

  if (!child) {
    return res.status(404).json({ message: "Criança não encontrada" });
  }

  reviewChild(child, revisado);
  
  return res.json({ message: "Criança revisada com sucesso" });
});

module.exports = router;