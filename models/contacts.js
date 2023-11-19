import fs from "fs/promises";
import { nanoid } from "nanoid";
import path, { resolve } from "path";

const contactsPath = resolve("models", "contacts.json");

const getContactIndex = (contacts, contactId) =>
  contacts.findIndex((contact) => contact.id === contactId);

const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsBuffer);
    const index = getContactIndex(contacts, contactId);
    if (index === -1) {
      return null;
    }
    return contacts[index];
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    const contacts = await JSON.parse(contactsBuffer);
    const index = getContactIndex(contacts, contactId);
    if (index === -1) {
      return null;
    }
    const [result] = contacts.splice(index, 1);
    updateContacts(contacts);
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsBuffer);
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    updateContacts(contacts);
    return newContact;
  } catch (error) {
    console.log(error.message);
  }
}

async function updateContact(id, data) {
  const contactsBuffer = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsBuffer);
  const index = getContactIndex(contacts, id);
  if (index === -1) {
    return null;
  }
  const newContact = { ...contacts[index], ...data };
  contacts[index] = newContact;
  updateContacts(contacts);
  return newContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
