const ContactsModels = require("../../Database/Models/Contacts");

async function NewContact(Contact, Res) {
  const New = new ContactsModels({
    namapengguna: "-",
    nama: Contact.pushname,
    notelepon: Contact.number,
    nomor: Contact.id._serialized,
    pangkat: "baru",
    updatedAt: new Date(),
  });
  Push.save();
  Res = "Berhasil";
  return Res;
} // Mengambil data Pengguna

module.exports = NewContact;
