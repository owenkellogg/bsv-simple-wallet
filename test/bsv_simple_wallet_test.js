require('dotenv').config();

const BSVSimpleWallet = require('../lib');
const assert = require('assert');

const bsv = require('bsv');

describe("BSV Simple Wallet", () => {

  describe("A Brand New Wallet", () => {
    var wallet;

    before(() => {

      wallet = BSVSimpleWallet.generate();

    });

    it("should have zero balance", async () => {

      let balance = await wallet.getBalance();

      assert.strictEqual(balance, 0);

    });

    it("should have a single address", () => {

      let address = wallet.getAddress();

    });

    it("should have a single private key", () => {

      let privateKey = wallet.getAddress();

    });

    it("sync should download the latest utxos", async () => {

      await wallet.sync(); 

    });

  });

  describe("A Wallet With Money", () => {

    var wallet;

    before(() => {

      wallet = new BSVSimpleWallet(new bsv.PrivateKey(process.env.BSV_SIMPLE_WALLET_TEST_WIF));

    });

    it('should have a non-zero balance', async () => {

      await wallet.sync();

      let balance = await wallet.getBalance();

      assert(balance > 0);

    });

    it('should build a signed payment but not send', async () => {

      let amount = 0.00001;

      let address = '1CVAjnAhfez8ScrLaCfvs2VXuHyaT2xizx';

      let signedTx = await wallet.buildSignedPayment(address, amount);

      console.log('signedTx', signedTx);

    });

  });

});
