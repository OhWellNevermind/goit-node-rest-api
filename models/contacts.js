import fs from "fs/promises";
import { nanoid } from "nanoid";
import path, { resolve } from "path";

const contactsPath = resolve("models", "contacts.json");

const getContactIndex = (contacts, contactId) =>
  contacts.findIndex((contact) => contact.id === contactId);

const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export function listContacts() {
  return fs
    .readFile(contactsPath)
    .then((contacts) => {
      return JSON.parse(contacts);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

export function getContactById(contactId) {
  return fs
    .readFile(contactsPath)
    .then((contactsBuffer) => {
      const contacts = JSON.parse(contactsBuffer);
      const index = getContactIndex(contacts, contactId);
      if (index === -1) {
        return null;
      }
      return contacts[index];
    })
    .catch((error) => {
      console.log(error.message);
    });
}

export function removeContact(contactId) {
  return fs
    .readFile(contactsPath)
    .then((contactsBuffer) => {
      const contacts = JSON.parse(contactsBuffer);
      const index = getContactIndex(contacts, contactId);
      if (index === -1) {
        return null;
      }
      const [result] = contacts.splice(index, 1);
      updateContacts(contacts);
      return result;
    })
    .catch((error) => {
      console.log(error.message);
    });
}

export function addContact(name, email, phone) {
  return fs
    .readFile(contactsPath)
    .then((contactsBuffer) => {
      const contacts = JSON.parse(contactsBuffer);
      const newContact = { id: nanoid(), name, email, phone };
      contacts.push(newContact);
      updateContacts(contacts);
      return newContact;
    })
    .catch((error) => {
      console.log(error.message);
    });
}
