#!/usr/bin/env node

const program = require('commander');

const BSVSimpleWallet = require('../lib');

const bsv = require('bsv');

var bitindex = require('bitindex-sdk').instance();

if (!process.env.BSV_SIMPLE_WALLET_WIF) {

  console.error('BSV_SIMPLE_WALLET_WIF environment variable must be set');

  process.exit(1);

}

const wallet = new BSVSimpleWallet(new bsv.PrivateKey(process.env.BSV_SIMPLE_WALLET_WIF));

program
  .command('balance')
  .action(async () => {

    await wallet.sync();

    console.log(await wallet.getBalance());

  });

program
  .command('address')
  .action(async () => {

    console.log(wallet.getAddress());

  });

program
  .command('send <address> <amount>')
  .action(async (address, amount) => {
    amount = parseFloat(amount);

    await wallet.sync();

    try {

      let tx = await wallet.buildSignedPayment(address, amount);

      console.log('tx', tx);

      let res = await bitindex.tx.send(tx);

      console.log(res);

    } catch(error) {

      console.error(error.message);
    }

  });



program.parse(process.argv);
