import express from "express";
import contactsController from "../../controllers/contacts.js";
import { isBodyEmpty } from "../../middlewares/isBodyEmpty.js";
const router = express.Router();

router.get("/", contactsController.getContacts);

router.get("/:contactId", contactsController.getContactById);

router.post("/", isBodyEmpty, contactsController.postContact);

router.delete("/:contactId", contactsController.deleteContact);

router.put("/:contactId", isBodyEmpty, contactsController.updateContact);

export default router;
