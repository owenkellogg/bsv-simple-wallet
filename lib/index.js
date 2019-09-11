
const bsv = require('bsv');
const http = require('http');

var bitindex = require('bitindex-sdk').instance();

const BigNumber = require('bignumber.js');

class BSVSimpleWallet {

  constructor(privateKey) {

    this.privateKey = privateKey;
    this.utxos = [];

  }

  static generate() {

    let privateKey = new bsv.PrivateKey();

    return new this(privateKey);

  }

  getAddress() {
    return this.privateKey.toAddress().toString();
  }

  getPrivateKey() {
    return this.privateKey;
  }

  getBalance() {

    return this.utxos.reduce((sum, utxo) => {

      return sum + utxo.amount;

    }, 0);
  }

  sendToAddress(address, amount, SendOptions) {

  }

  async sync() {
    let address = this.getAddress();

    let utxos = await bitindex.address.getUtxos(address);

    if (utxos) {

      this.utxos = utxos;

    }

  }

  async buildSignedPayment(address, amount) {

    let fee = 0.00001;

    let opreturn = bsv.Script.buildSafeDataOut(['anypayinc', 'utf8', 'we all love bitcoin']).toASM()

    await this.sync();

    let from = await getUtxos(amount, this.utxos);

    let tx = new bsv.Transaction();

    let a = new BigNumber(amount);

    console.log("N",a.times(100000000).toNumber()); 

    tx
      .from(from)
      .to(address, parseInt(a.times(100000000).toNumber()))
      //.change(this.getAddress())
      .fee(fee)
      .sign(this.getPrivateKey());
      //.data(opreturn);

    return tx;

    // compute utxos for address

  }

}

module.exports = BSVSimpleWallet;

async function getUtxos(amount, utxos) {

  let inputs = [];
  let sum = 0;

  let sorted = utxos.sort((a, b) => {

    return a.amount > b.amount;

  });

  var i = 0;

  while (sum < amount) {

    inputs.push(sorted[i]);

    sum += sorted.amount;

    i++;
    
  }

  return inputs.map(input => {

    let i = Object.assign(input, {
      txId: input.txid,
      satoshis: parseInt(input.satoshis)
    });

    return i;

  });

}


