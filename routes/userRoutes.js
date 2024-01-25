import express from "express";
const router = express.Router();

// Require controller modules.
import user_controller from "../controllers/userController.js"

/// USER ROUTES ///

// GET request for list of all Users.
router.get("/", user_controller.user_list);

// GET request for one User.
router.get("/:id", user_controller.user_detail);

// POST request for creating User.
router.post("/", user_controller.user_create_post);

// PATCH request to update User.
router.patch("/:id", user_controller.user_update_patch);

// DELETE request to delete User.
router.delete("/:id", user_controller.user_delete_delete);

export default router;