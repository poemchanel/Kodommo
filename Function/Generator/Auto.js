const { setTimeout } = require("timers/promises");
const CekStatusDB = require("../Routes/CekStatusDB");
const VerifikasiKontak = require("../VerifikasiKontak");
const { AutoOn, AutoOff, AutoCek } = require("../Update/HargaProduks");
const { HargaKonveksiOff } = require("../Update/HargaKonveksi");

async function Auto(pesan, kontak, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
        let statusscrapupdate = "";
        let tmp = pesan.body.replace(/!Auto/i, "").replace(/ /g, "");
        switch (tmp.toLowerCase()) {
          case "on":
            statusscrapupdate = await HargaKonveksiOff();
            await setTimeout(5000);
            statusscrapupdate = await AutoOn();
            res = {
              caption: `╭──「 *Perintah Berhasil* 」
${statusscrapupdate.status}
╰───────────────`,
            };
            break;
          case "off":
            statusscrapupdate = await AutoOff();
            res = {
              caption: `╭──「 *Perintah Berhasil* 」
${statusscrapupdate.status}
│Total Produk ${statusscrapupdate.totalproduk}
│Berhasil Mengupdate ${statusscrapupdate.diupdate}
│Terhenti di Antrian ke ${statusscrapupdate.antrian + 1}
╰───────────────`,
            };
            break;
          case "cek":
            statusscrapupdate = await AutoCek();
            res = {
              caption: `╭──「 *Perintah Berhasil* 」
${statusscrapupdate.status}
│Total Produk ${statusscrapupdate.totalproduk}
│Berhasil Mengupdate ${statusscrapupdate.diupdate}
│Sedang dalam Antrian ke ${statusscrapupdate.antrian + 1}
╰───────────────`,
            };
            break;
          case "log":
            statusscrapupdate = await AutoCek();
            res = {
              caption: `╭──「 *Perintah Berhasil* 」
│Log Auto Update Produk :
${statusscrapupdate.log.join(`\n\r`)}
╰───────────────`,
            };
            break;
          case "gagal":
            statusscrapupdate = await AutoCek();
            res = {
              caption: `╭──「 *Perintah Berhasil* 」
│Log produk yang gagal diupdate :
${statusscrapupdate.gagal.join(`\n\r`)}
╰───────────────`,
            };
            break;
          case "":
            res = {
              caption: `╭──「 *Perintah Gagal* 」
│Harap masukan perintah 
│setelah !Auto
│Contoh:
│!Auto cek
╰───────────────`,
            };
            break;
          default:
            res = {
              caption: `╭──「 *Perintah Gagal* 」
│Perintah tidak ditemukan
│list perintah !Auto : 
│•!Auto on
│•!Auto off
│•!Auto cek
│•!Auto log
╰───────────────`,
            };
            break;
        }
        break;
      case "Kosong":
        res = {
          caption: `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar, Silahkan
│mendaftar dengan !daftar
╰───────────────`,
        };
        break;
      case "member": // Kontak Berpangkat member
      case "baru":
      default:
        res = {
          caption: `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat 
│diakses oleh :
│• *Admin*
│───────────────
│Status anda saat ini : ${pengguna.pangkat}
╰───────────────`,
        };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = {
      caption: `╭──「 *Maintenence* 」
│Mohon Maaf @${kontak.number}, :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`,
    };
  }
  return res;
}

module.exports = Auto;
