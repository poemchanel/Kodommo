const ContactsModels = require("../../Database/Models/Contacts");

async function DeleteContact(Contact, Res) {
  Res = await ContactsModels.deleteOne({ _id: Contact._id });
  return Res;
} // Mengambil data Pengguna

module.exports = DeleteContact;
