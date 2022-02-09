 import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { artifacts, ethers } from "hardhat";
import { OracleProxy, OracleProxy__factory, PriceOracle, PriceOracleV2, PriceOracleV2__factory, PriceOracleV3, PriceOracleV3__factory, PriceOracle__factory } from "../typechain";

// const PriceOracle = artifacts.require("PriceOracle");
// const PriceOracleV2 = artifacts.require("PriceOracleV2");
// const PriceOracleV3 = artifacts.require("PriceOracleV3");
// const OracleProxy = artifacts.require("OracleProxy");


describe("Oracle", async() => {
  let OracleProxyFactory:OracleProxy__factory
  let oracleProxy:OracleProxy

  let PriceOracleFactory:PriceOracle__factory
  let PriceOracleV2Factory:PriceOracleV2__factory
  let PriceOracleV3Factory:PriceOracleV3__factory

  let oracleImplv1:PriceOracle
  let oracleImplv2:PriceOracleV2
  let oracleImplv3:PriceOracleV3

  let owner:SignerWithAddress
  let operator:SignerWithAddress 
  let nobody:SignerWithAddress

  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
    operator = accounts[1]
    nobody = accounts[3]

    OracleProxyFactory = await ethers.getContractFactory("OracleProxy")
    PriceOracleFactory = await ethers.getContractFactory("PriceOracle")
    PriceOracleV2Factory = await ethers.getContractFactory("PriceOracleV2")
    PriceOracleV3Factory = await ethers.getContractFactory("PriceOracleV3")


    oracleImplv1 = await PriceOracleFactory.deploy()
    await oracleImplv1.deployed()
    oracleImplv2 = await PriceOracleV2Factory.deploy()
    await oracleImplv2.deployed()
    oracleImplv3 = await PriceOracleV3Factory.deploy()
    await oracleImplv3.deployed()
  })


 it('oracle v1 deployment works - owner is set once', async() => {
     oracleProxy = await OracleProxyFactory.deploy("0x473be604",oracleImplv1.address)
     const proxy = PriceOracleFactory.attach(oracleProxy.address) 
     const proxyOwner = await proxy.owner()
     await expect(proxy.constructor1()).to.be.revertedWith("Already initalized")
     expect(proxyOwner).to.equal(owner.address)
  })

  it("only operator can update price in V1", async() => {
    oracleProxy = await OracleProxyFactory.deploy("0x473be604",oracleImplv1.address) //await OracleProxy.new(0x473be604, oracleImplv1.address)
    const proxy = PriceOracleFactory.attach(oracleProxy.address)

    await proxy.connect(owner).setOperator(operator.address, {
      from: owner.address
    })

    await proxy.connect(operator).setPrice(1234, {
      from: operator.address
    })

    const newPrice = await proxy.price()
    await expect(proxy.setPrice(1234,{
        from: owner.address
    })).to.be.revertedWith("Only operator is allowed to perform this action")
    expect(newPrice).to.equal(1234) 

  })

  it("owner can upgrade proxy implementation - twice", async() => {
    oracleProxy = await OracleProxyFactory.deploy("0x473be604",oracleImplv1.address)
    let proxy = PriceOracleFactory.attach(oracleProxy.address) 
 
    await proxy.connect(owner).setOperator(operator.address, {
      from: owner.address
    })
    // we update proxy implementation to V2
    await proxy.updateCode(oracleImplv2.address)
    
    //proxy = PriceOracleFactory.attach(oracleProxy.address) 
    oracleProxy = await OracleProxyFactory.deploy("0x473be604",oracleImplv1.address)
    let proxy2 =  PriceOracleV2Factory.attach(oracleProxy.address)
    await proxy2.updateCode(oracleImplv3.address)
  })

})
