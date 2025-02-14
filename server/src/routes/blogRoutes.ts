import { Router } from "express";
import blogController from "../controllers/blogController";

const router = Router();

router.get("/all", blogController.getAllBlogs);
router.get("/categories", blogController.getAllCategories);
router.get("/related/:blogId", blogController.getBlogByCategoryRelated);

router.get("/:blogId", blogController.getBlogById);

export default router;
