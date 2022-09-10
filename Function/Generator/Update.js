const { setTimeout } = require("timers/promises");
const CekStatusDB = require("../Routes/CekStatusDB");
const VerifikasiKontak = require("../VerifikasiKontak");
const TarikProduk = require("../Routes/TarikProduk");
const TarikProduksKonveksi = require("../Routes/TarikProduksKonveksi");
const HargaProduk = require("../Update/HargaProduk");
const { HargaKonveksiMulai, HargaKonveksiOff, HargaKonveksiOn, HargaKonveksiCek } = require("../Update/HargaKonveksi");
const { AutoOff, AutoOn } = require("../Update/HargaProduks");

async function Update(pesan, kontak, nomor, res) {
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
                caption: `Status Update Konveksi : ${status.status}
Berhasil mengupdate ${status.diupdate}/${status.totalproduk}
Gagal mengupdate ${status.gagal.length}
Antrian Update Saat ini ${status.antrian}/${status.totalproduk}
`,
              };
              break;
            case "LOG":
              status = await HargaKonveksiCek();
              res = {
                caption: `Log Update Konveksi :
${status.log.join(`\r\n`)}`,
              };
              break;
            case "GAGAL":
              status = await HargaKonveksiCek();
              res = {
                caption: `Log Gagal Update Konveksi :
${status.gagal.join(`\r\n`)}`,
              };
              break;
            case "ON":
              status = await AutoOff();
              await setTimeout(5000);
              status = await HargaKonveksiOn();
              res = {
                caption: `${status.status}
  Berhasil mengupdate ${status.diupdate}/${status.totalproduk}
  Gagal mengupdate ${status.gagal.length}
  Antrian update saat ini ${status.antrian}/${status.totalproduk}
  `,
              };
              break;
            case "OFF":
              status = await HargaKonveksiOff();
              res = {
                caption: `${status.status}
Berhasil mengupdate ${status.diupdate}/${status.totalproduk}
Gagal mengupdate ${status.gagal.length}
Antrian update saat ini ${status.antrian}/${status.totalproduk}
`,
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
                    caption: `Berhasil Mengupdate Produk ${tmp}
Log:
${update.log.join(`\r\n`)}`,
                  };
                } else {
                  res = {
                    caption: `Gagal Mengupdate Produk ${tmp}
Log:
${update.log.join(`\r\n`)}`,
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
                    caption: `${update.status} ${tmp.toUpperCase()}
Total Porduk ${update.totalproduk}`,
                  };
                } else {
                  res = { caption: `Tidak dapat menemukan konvekesi/produk dengan kode : ${tmp}` };
                }
              }
              break;
          }
        } else {
          res = { caption: `Harap Masukan Konveksi/KodeBarang setelah !update/!scrap. contoh !update D1002` };
        }
        break;
      case "member": // Kontak Berpangkat member
      case "baru":
      case "Kosong":
        res = {
          caption: `╭─「 *Perintah Ditolak* 」
│Perintah ini hanya dapat diakses :
│• *Admin*
│────────────────
│Status anda saat ini : ${pengguna.pangkat}
╰────────────────`,
        };
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res = { caption: `Terjadi kesalahan terhadap kontak anda, Segera hubungi Admin` };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = { caption: "Maaf Bot sedang dalam Maintenence.." };
  }
  return res;
}

module.exports = Update;
