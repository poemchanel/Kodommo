async function Ping(pesan, kontak, res) {
  res = { caption: "Pong" };
  console.log(pesan);
  console.log("-----------------");
  console.log(kontak);
  return res;
} //Release //Membalas Pesan Ping

module.exports = Ping;
