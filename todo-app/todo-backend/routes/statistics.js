const redis = require("../redis");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const count = await redis.get("added_todos");
  res.json({ added_todos: Number(count) });
});

module.exports = router;
