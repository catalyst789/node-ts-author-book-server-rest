import express from "express";
import controlller from "../controllers/Book";
import { Schemas, validateSchema } from "../middleware/validateSchema";

const router = express.Router();

router.post("/create", validateSchema(Schemas.book.create), controlller.createBook);
router.get("/get/:bookId", controlller.readBook);
router.get("/get/", controlller.readAllBook);
router.patch("/update/:bookId", validateSchema(Schemas.book.update), controlller.UpdateBook);
router.delete("/delete/:bookId", controlller.DeleteBook);

export = router;
