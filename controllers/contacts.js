import { HttpError } from "../helpers/HttpError.js";
import Contact, {
  contactFavouriteSchema,
  newContactSchema,
  updateContactSchema,
} from "../models/Contact.js";

const getContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.status(200).json(result);
  } catch (error) {}
};

const getContactById = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const result = await Contact.findById(id);
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
    const newContact = await Contact.create({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
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
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message || "Missing fields");
  }
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body);
    console.log(updatedContact);
    res.status(201).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateIsContactFavourite = async (req, res, next) => {
  console.log(req.params);
  const id = req.params.contactId;
  const { error } = contactFavouriteSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message || "Missing fields");
  }
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body);
    console.log(updateContact);
    console.log("adasdasad");
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
  updateIsContactFavourite,
};
