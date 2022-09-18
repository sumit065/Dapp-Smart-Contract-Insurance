const { expect } = require("chai");
const { ethers } = require("hardhat");

describe( "My Insurance Contract Tests", function() {
  it("Should test insurance application process.", async function (){
    const Insurance = await ethers.getContractFactory("Insurance");
    const insurance = await Insurance.deploy( 100, 100);
    await insurance.deployed();

    const contractAddress = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199';
    const deployerAddress = '0x1199f6940e2eb28930efb4cef49b2d1f2c9cf4bc';
    const applyForInsurance = await insurance.applyForInsurance( contractAddress, 103, { value : 100 } );

     // wait until the transaction is mined
     await applyForInsurance.wait();

     expect( await insurance.registeredContractToSumInsuredMap('0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199')).to.equal( 103 );
     expect( await insurance.applicantContracts('0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199')).to.equal( true );

  });
});