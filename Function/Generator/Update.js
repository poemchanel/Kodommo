const { setTimeout } = require("timers/promises");
const CekStatusDB = require("../Routes/CekStatusDB");
const VerifikasiKontak = require("../VerifikasiKontak");
const TarikProduk = require("../Routes/TarikProduk");
const TarikProduksKonveksi = require("../Routes/TarikProduksKonveksi");
const HargaProduk = require("../Update/HargaProduk");
const { HargaKonveksiMulai, HargaKonveksiOff, HargaKonveksiOn, HargaKonveksiCek } = require("../Update/HargaKonveksi");
const { AutoOff, AutoOn } = require("../Update/HargaProduks");

async function Update(pesan, kontak, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
        let status = "";
        let tmp = pesan.body
          .replace(/!update/i, "")
          .replace(/!scrap/i, "")
          .replace(/ /g, "");
        if (tmp !== "") {
          switch (tmp.toUpperCase()) {
            case "CEK":
              status = await HargaKonveksiCek();
              res = {
                caption: `╭──「 *Perintah Berhasil* 」
│Status Update Konveksi : ${status.status}
│Berhasil mengupdate ${status.diupdate}/${status.totalproduk}
│Gagal mengupdate ${status.gagal.length} produk
│Antrian update saat ini ${status.antrian}/${status.totalproduk}
╰───────────────`,
              };
              break;
            case "LOG":
              status = await HargaKonveksiCek();
              res = {
                caption: `╭──「 *Perintah Berhasil* 」
│Log Update Konveksi :
${status.log.join(`\n\r`)}
╰───────────────`,
              };
              break;
            case "GAGAL":
              status = await HargaKonveksiCek();
              res = {
                caption: `╭──「 *Perintah Berhasil* 」
│Log produk yang gagal diupdate :${status.gagal.join(`\n│\r`)}
╰───────────────`,
              };
              break;
            case "ON":
              status = await HargaKonveksiOff();
              status = await AutoOff();
              await setTimeout(5000);
              status = await HargaKonveksiOn();
              res = {
                caption: `╭──「 *Perintah Berhasil* 」
│${status.status}
│Berhasil mengupdate ${status.diupdate}/${status.totalproduk}
│Gagal mengupdate ${status.gagal.length} produk
│Antrian update saat ini ${status.antrian}/${status.totalproduk}
╰───────────────`,
              };
              break;
            case "OFF":
              status = await HargaKonveksiOff();
              res = {
                caption: `╭──「 *Perintah Berhasil* 」
│${status.status}
│Berhasil mengupdate ${status.diupdate}/${status.totalproduk}
│Gagal mengupdate ${status.gagal.length} produk
│Antrian update saat ini ${status.antrian}/${status.totalproduk}
╰───────────────`,
              };
              break;
            default:
              let produk = await TarikProduk(tmp.toUpperCase());
              if (produk.length !== 0) {
                let on;
                let cek = await HargaKonveksiCek();
                if (cek.state === true) {
                  cek = await HargaKonveksiOff();
                  on = "konveksi";
                } else {
                  cek = await AutoOff();
                  on = "auto";
                }
                await setTimeout(5000);
                let update = await HargaProduk(produk);
                if (update.status === true) {
                  res = {
                    caption: `╭──「 *Perintah Berhasil* 」
│Berhasil Mengupdate Produk ${tmp}
│Log:
${update.log.join(`\n\r`)}
╰───────────────`,
                  };
                } else {
                  res = {
                    caption: `╭──「 *Perintah Gagal* 」
│Gagal Mengupdate Produk ${tmp}
│Log:
${update.log.join(`\n\r`)}
╰───────────────`,
                  };
                }
                if (on === "konveksi") {
                  cek = await HargaKonveksiOn();
                } else {
                  cek = await AutoOn();
                }
              } else {
                let konveksi = await TarikProduksKonveksi(tmp.toUpperCase());
                if (konveksi.length !== 0) {
                  status = await AutoOff();
                  status = await HargaKonveksiOff();
                  await setTimeout(5000);
                  const update = await HargaKonveksiMulai(konveksi, 0);
                  res = {
                    caption: `╭──「 *Perintah Berhasil* 」
│${update.status} ${tmp.toUpperCase()}
│Total Porduk ${update.totalproduk}
╰───────────────`,
                  };
                } else {
                  res = {
                    caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│atau konveksi dengan
│kode : ${tmp}
╰───────────────`,
                  };
                }
              }
              break;
          }
        } else {
          res = {
            caption: `╭──「 *Perintah Gagal* 」
│Harap masukan kode produk
│atau konveksi setelah 
│perintah !Update
│Contoh: 
│!Update D1008
╰───────────────`,
          };
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
│• *Member*
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

module.exports = Update;
