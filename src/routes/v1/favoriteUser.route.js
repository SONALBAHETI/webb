import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import responseHandler from "../../utils/responseHandler.js";
import favoriteUserController from "../../controllers/favoriteUser.controller.js";
import favoriteUserValidation from "../../validation/favoriteUser.validation.js";

const router = express.Router();

router
  .route("/")
  .get(auth(), responseHandler(favoriteUserController.getFavoriteUsers))
  .post(
    auth(),
    validate(favoriteUserValidation.createFavoriteUser),
    responseHandler(favoriteUserController.createFavoriteUser)
  );

router
  .route("/:userId")
  .get(auth(), responseHandler(favoriteUserController.getSingleFavoriteUser))
  .delete(auth(), responseHandler(favoriteUserController.deleteFavoriteUser));

export default router;
