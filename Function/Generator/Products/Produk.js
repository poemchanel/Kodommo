const VerifikasiKontak = require("../../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");
const TarikProduk = require("../../Routes/TarikProduk");
const RenderProduk = require("../../Render/RenderProduk");

async function Produk(pesan, kontak, res) {
  res = [];
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        let tmp = pesan.body.split(" ").filter((e) => e !== "");
        if (tmp.length !== 1) {
          for (let i = 0; i < tmp.length; i++) {
            let produk;
            let render;
            if (tmp[i].toLowerCase() !== "!produk") {
              if (tmp[i].includes("_") === true) {
                let tmp1 = tmp[i].split("_");
                produk = await TarikProduk(tmp1[0].toUpperCase());
                if (produk.length !== 0) {
                  if (produk[tmp1[1] - 1] !== undefined) {
                    render = await RenderProduk(produk[tmp1[1] - 1]);
                    res.push({
                      caption: render,
                    });
                  } else {
                    res.push({
                      caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│nomor ${i} di kode : ${tmp[i]}
╰───────────────`,
                    });
                  }
                } else {
                  res.push({
                    caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│dengan kode : ${tmp[i]}
╰───────────────`,
                  });
                }
              } else {
                produk = await TarikProduk(tmp[i].toUpperCase());
                if (produk.length !== 0) {
                  if (produk.length > 1) {
                    let j = 1;
                    res.push({
                      caption: `╭──「 *Perintah Berhasil* 」
│Ditemukan lebih dari 1 produk
│dengan kode ${tmp[i].toUpperCase()}
│gunakan perintah 
│!produk ${tmp[i].toUpperCase()}_<Noproduk>
│untuk melihat detail produk
│contoh  : !produk ${tmp[i].toUpperCase()}_2
│──「 *List Nomor Produk ${tmp[i].toUpperCase()}* 」─${produk.map(
                        (e) => `\n│ ${j++}: ${e.konveksi}-${e.namabarang.substring(0, 12)}...`
                      )}
╰───────────────`,
                    });
                  } else {
                    render = await RenderProduk(produk[0]);
                    res.push({
                      caption: render,
                    });
                  }
                } else {
                  res.push({
                    caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│dengan kode : ${tmp[i]}
╰───────────────`,
                  });
                }
              }
            }
          }
        } else {
          res.push({
            caption: `╭──「 *Perintah Gagal* 」
│Harap masukan kode produk
│setelah perintah !produk
│Contoh: 
│!Produk D1008 D1200 ...
╰───────────────`,
          });
        }
        break;
      case "Kosong":
        res.push({
          caption: `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar, Silahkan
│mendaftar dengan !daftar
╰───────────────`,
        });
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res.push({
          caption: `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat 
│diakses oleh :
│• *Admin*
│• *Member*
│───────────────
│Status anda saat ini : ${pengguna.pangkat}
╰───────────────`,
        });
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res.push({
      caption: `╭──「 *Maintenence* 」
│Mohon Maaf @${kontak.number}, :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`,
    });
  }
  return res;
}

module.exports = Produk;
