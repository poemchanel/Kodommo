async function Ping(Message, From, Res) {
  Res = "Pong";
  console.log(Message);
  console.log(From);
  return Res;
} //Release //Membalas Message Ping

module.exports = Ping;
