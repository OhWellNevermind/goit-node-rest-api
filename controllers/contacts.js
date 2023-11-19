import { HttpError } from "../helpers/HttpError.js";
import contactsService from "../models/contacts.js";
import {
  newContactSchema,
  updateContactSchema,
} from "../schemas/contactSchema.js";

const getContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.status(200).json(result);
  } catch (error) {}
};

const getContactById = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const postContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const { error } = newContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const deletedContact = await contactsService.removeContact(id);
    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const id = req.params.contactId;
  const data = req.body;
  const { error } = updateContactSchema.validate(data);
  if (error) {
    throw HttpError(400, error.message || "Missing fields");
  }
  try {
    const updatedContact = await contactsService.updateContact(id, data);
    res.status(201).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export default {
  getContacts,
  getContactById,
  postContact,
  deleteContact,
  updateContact,
};
