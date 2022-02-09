import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { Vault, VaultFactory, VaultFactory__factory, Vault__factory } from "../typechain"

describe("Vault", async() => {
    let Vault:Vault__factory
    let vault:Vault
    let VaultFactoryFactory:VaultFactory__factory
    let vaultFactory:VaultFactory
    
    let accounts:SignerWithAddress[]

    beforeEach(async()=> {
        accounts = await ethers.getSigners();
        Vault = await ethers.getContractFactory("Vault")
        vault = await Vault.deploy()
        await vault.deployed();

        VaultFactoryFactory = await ethers.getContractFactory("VaultFactory")
        vaultFactory =await VaultFactoryFactory.deploy(10)
        await vaultFactory.deployed()
    })

    // it("should be deployed", async() => {
       
    // })

    it('can deposit max vault capacity', async() => {
       await vaultFactory.initVault(vault.address,{
           value:10
       })
       const balance = await vault.getBalance()
       expect(balance.toString()).to.equal('10')
     })

    it('can not deposit more than max vault capacity', async() => {
       await expect(
         vaultFactory.initVault(vault.address,{
        value:100
       })).to.be.revertedWith("exceed deposit limitation")
       const balance = await vault.getBalance()
       expect(balance.toString()).to.equal("0")
     })
})
