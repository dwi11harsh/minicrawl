import express from "express";

const v1router = express.Router();

v1router.get("/ping", (req, res) => {
  res.send({ message: "v1 is alive" });
});

export default v1router;
