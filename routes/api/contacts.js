import express from "express";
import contactsController from "../../controllers/contacts.js";
import { isBodyEmpty } from "../../middlewares/isBodyEmpty.js";
import { isValidId } from "../../middlewares/isValidId.js";
import authenticate from "../../middlewares/authenticate.js";
const router = express.Router();

router.use(authenticate);

router.get("/", contactsController.getContacts);

router.get("/:contactId", isValidId, contactsController.getContactById);

router.post("/", isBodyEmpty, contactsController.postContact);

router.delete("/:contactId", isValidId, contactsController.deleteContact);

router.put(
  "/:contactId",
  isValidId,
  isBodyEmpty,
  contactsController.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  contactsController.updateIsContactFavourite
);

export default router;
