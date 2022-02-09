import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import console from "console"
import { ethers } from "hardhat"
import { SimpleToken, SimpleToken__factory } from "../typechain"

xdescribe("Simple Token", async() => {
    let SimpleTokenFactory:SimpleToken__factory
    let simpleToken:SimpleToken
    let accounts:SignerWithAddress[]
    before(async()=>{
        accounts = await ethers.getSigners();
    })

    it("should be deployed", async()=> {
        SimpleTokenFactory = await ethers.getContractFactory("SimpleToken");
        simpleToken = await SimpleTokenFactory.deploy()
        await simpleToken.deployed();
        console.log("token address:=>", simpleToken.address)
    })

    it("can mint and balance is updated", async() => {
        await simpleToken.mint(accounts[1].address, 1000)
        const balanceAcc1 = await simpleToken.balanceOf(accounts[1].address)
        expect(balanceAcc1).to.equal(1000)
    })

    it("multiple calls to mint - gas costs under X", async() => {
        for(let i = 0; i < 100; i++) {
          const hash = ethers.utils.solidityKeccak256(['uint'],[i]) //web3.utils.soliditySha3(i)
          const address = hash.substring(0, 42)
          const receipt = await simpleToken.mint(address, 1000)
          const balance = await simpleToken.balanceOf(address)
          expect(balance).to.equal(1000)
          const gasFee = +ethers.utils.formatEther(receipt.gasPrice ?? 0)
          expect( gasFee< 100000).to.equal(true)
        }
    })
})

