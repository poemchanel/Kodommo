const ContactsModels = require("../../Database/Models/Contacts");

async function FindContact(Number, Res) {
  Res = await ContactsModels.find({
    notelepon: Number,
  });
  return Res;
} // Mengambil data Pengguna

module.exports = FindContact;
