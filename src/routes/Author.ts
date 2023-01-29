import express from "express";
import controlller from "../controllers/Author";
import { Schemas, validateSchema } from "../middleware/validateSchema";

const router = express.Router();

router.post("/create", validateSchema(Schemas.author.create), controlller.createAuthor);
router.get("/get/:authorId", controlller.readAuthor);
router.get("/get/", controlller.readAllAuthor);
router.patch("/update/:authorId", validateSchema(Schemas.author.update), controlller.UpdateAuthor);
router.delete("/delete/:authorId", controlller.DeleteAuthor);

export = router;
