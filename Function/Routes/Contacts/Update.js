const ContactsModels = require("../../Database/Models/Contacts");

async function UpdateContact(Contact) {
  const Update = await ContactsModels.findOneAndUpdate(
    {
      notelepon: Contact.notelepon,
    },
    Contact
  ); // Mencari data Produk dengan key kodebarang lalu update
}

module.exports = UpdateContact;
