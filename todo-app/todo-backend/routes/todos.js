const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const redis = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  const count = await redis.get("added_todos");
  const updatedCount = Number(count) + 1;
  await redis.set("added_todos", updatedCount);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  const deletedTodo = await Todo.findByIdAndDelete(req.todo.id);

  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  const todo = await req.todo;
  res.send(todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.todo.id,
    { text: req.body.text, done: req.body.done },
    { new: true },
  );
  res.send(updatedTodo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
