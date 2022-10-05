const puppeteer = require("puppeteer"); // Export Module untuk Scraping Web

async function ScrapDataProduk(req, res) {
  console.log("Proses Scraping Produk Dimulai");
  let data = req;
  const browser = await puppeteer.launch({ headless: false }); // Membuka Browser
  const page = await browser.newPage(); // Membuka Tab Baru di Browser

  await page.goto(data.linkproduk); // Membuka Link
  await page.waitForSelector("[class='_2Shl1j']"); // Menunggu hingga browser menampilkan Class
  let element0 = await page.$("[class='_2Shl1j']"); // Mengambil Class
  let value0 = await page.evaluate((el) => el.textContent, element0); // Mengambil value  diclass tersebut
  data.hargaproduk = value0.replace("Rp", "").replace(".", ""); // update data harga produk dengan value yang didapat
  console.log(`   Harga Produk Berhasil didapatkan : ${value0}`);
  if (data.pesaing[0].hargapesaing != "-") {
    await page.goto(data.pesaing[0].linkpesaing);
    await page.waitForSelector("[class='_2Shl1j']");
    let element1 = await page.$("[class='_2Shl1j']");
    let value1 = await page.evaluate((el) => el.textContent, element1);
    data.pesaing[0].hargapesaing = value1.replace("Rp", "").replace(".", "");
    console.log(`   Harga Pesaing 1 Berhasil didapatkan : ${value1}`);
  } // Cek Jika terdapat data pesaing 1
  if (data.pesaing[1].hargapesaing != "-") {
    await page.goto(data.pesaing[0].linkpesaing);
    await page.waitForSelector("[class='_2Shl1j']");
    let element2 = await page.$("[class='_2Shl1j']");
    let value2 = await page.evaluate((el) => el.textContent, element2);
    data.pesaing[1].hargapesaing = value2.replace("Rp", "").replace(".", "");
    console.log(`   Harga Pesaing 2 Berhasil didapatkan : ${value2}`);
  } // Cek jika terdapat data pesaing 2

  data.updatedAt = new Date(); // update data tanggal
  console.log(`   Data Updated : ${data.updatedAt}`);
  await browser.close(); //Tutup Browser
  res = data;
  return res; // Kirim Kembali data yang telah diupdate
} // Mengambil data Harga Produk

module.exports = {
  ScrapDataProduk,
};
