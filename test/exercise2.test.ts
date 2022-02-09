

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import console from "console"
import { ethers } from "hardhat"
import { Hacker, Hacker__factory, SharesFund, SharesFund__factory, SimpleToken, SimpleToken__factory } from "../typechain"

xdescribe("SharesFund", async() => {
    let SharesFundFactory:SharesFund__factory
    let sharesFund:SharesFund
    let HackerFactory:Hacker__factory
    let hacker:Hacker

    let accounts:SignerWithAddress[]
    before(async()=>{
        accounts = await ethers.getSigners();
    })

    it("should be deployed", async()=> {
        SharesFundFactory = await ethers.getContractFactory("SharesFund");
        sharesFund = await SharesFundFactory.deploy()
        await sharesFund.deployed();
        console.log("token address:=>", sharesFund.address)

        HackerFactory = await ethers.getContractFactory("Hacker");
        hacker = await HackerFactory.deploy(sharesFund.address)
        await hacker.deployed();
        console.log("token address:=>", hacker.address)
    })

      it("hacker cannot steal funds", async() => {
        await sharesFund.connect(accounts[2]).deposit({
            value:1,
            from: accounts[2].address
        })
        await sharesFund.connect(accounts[3]).deposit({
            value:5,
            from: accounts[3].address
        })

        await sharesFund.connect(accounts[4]).deposit({
            value:10,
            from: accounts[4].address
        })

        await expect( hacker.hack({
            value:1,
            gasPrice: 452349612//60000000
        })).to.reverted
        const fundBalanceAfter = await sharesFund.getBalance()
        const sharesAccount2 = await sharesFund.shares(accounts[2].address)
        const sharesAccount3 = await sharesFund.shares(accounts[3].address)
        const sharesAccount4 = await sharesFund.shares(accounts[4].address)
        expect(sharesAccount2).to.equal(1)
        expect(sharesAccount3).to.equal(5)
        expect(sharesAccount4).to.equal(10)
        expect(fundBalanceAfter).to.equal(16)
    })

})



// const SharesFund = artifacts.require("SharesFund");
// const Hacker = artifacts.require("Hacker");
// const truffleAssert = require('truffle-assertions');

// contract("SharesFund", async accounts => {

//   let sharesFund
//   let hacker

//   beforeEach(async () => {
//     sharesFund = await SharesFund.new()
//     hacker = await Hacker.new(sharesFund.address)
//   })

//   it("hacker cannot steal funds", async() => {
//     await sharesFund.deposit({
//       value: web3.utils.toWei('1', "gwei"),
//       from: accounts[2]
//     })
//     await sharesFund.deposit({
//       value: web3.utils.toWei('5', "gwei"),
//       from: accounts[3]
//     })
//     await sharesFund.deposit({
//       value: web3.utils.toWei('10', "gwei"),
//       from: accounts[4]
//     })

//     await truffleAssert.fails(hacker.hack({
//       value: web3.utils.toWei('1', "gwei"),
//       gas: '6000000'
//     }));

//     const fundBalanceAfter = await web3.eth.getBalance(sharesFund.address)
//     const sharesAccount2 = await sharesFund.shares(accounts[2])
//     const sharesAccount3 = await sharesFund.shares(accounts[3])
//     const sharesAccount4 = await sharesFund.shares(accounts[4])

//     assert.equal(sharesAccount2, web3.utils.toWei('1', "gwei"))
//     assert.equal(sharesAccount3, web3.utils.toWei('5', "gwei"))
//     assert.equal(sharesAccount4, web3.utils.toWei('10', "gwei"))
//     assert.equal(fundBalanceAfter, web3.utils.toWei('16', "gwei"))
//   })

// })
