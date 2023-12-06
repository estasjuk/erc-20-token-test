const { expect } = require('chai');
const { ethers } = require("hardhat");

// Start test block
describe('TestErcToken', function () {
  before(async function () {
    this.TestErcToken = await ethers.getContractFactory('TestErcToken');
  });

  beforeEach(async function () {
    this.testErcToken = await this.TestErcToken.deploy();
    await this.testErcToken.waitForDeployment();

    this.decimals = await this.testErcToken.decimals();

    const signers = await ethers.getSigners();

    this.ownerAddress = signers[0].address;
    this.recipientAddress = signers[1].address;

    this.signerContract = this.testErcToken.connect(signers[1]);
  });

  // Test cases
  it('Creates a token with a name', async function () {
    expect(await this.testErcToken.name()).to.exist;
    // expect(await this.testErcToken.name()).to.equal('FunToken');
  });

  it('Creates a token with a symbol', async function () {
    expect(await this.testErcToken.symbol()).to.exist;
    // expect(await this.testErcToken.symbol()).to.equal('FUN');
  });

  it('Has a valid decimal', async function () {
    expect((await this.testErcToken.decimals()).toString()).to.equal('18');
  })

  it('Has a valid total supply', async function () {
    const expectedSupply = ethers.parseUnits('7', this.decimals);
    expect((await this.testErcToken.totalSupply()).toString()).to.equal(expectedSupply);
  });

  it('Is able to query account balances', async function () {
    const ownerBalance = await this.testErcToken.balanceOf(this.ownerAddress);
    expect(await this.testErcToken.balanceOf(this.ownerAddress)).to.equal(ownerBalance);
  });

  it('Transfers the right amount of tokens to/from an account', async function () {
    const transferAmount = 0.01;
    await expect(this.testErcToken.transfer(this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))).to.changeTokenBalances(
        this.testErcToken,
        [this.ownerAddress, this.recipientAddress],
        [-transferAmount, transferAmount]
      );
  });

  it('Emits a transfer event with the right arguments', async function () {
    const transferAmount = 0.0005;
    await expect(this.testErcToken.transfer(this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals)))
        .to.emit(this.testErcToken, "Transfer")
        .withArgs(this.ownerAddress, this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
  });

  it('Allows for allowance approvals and queries', async function () {
    const approveAmount = 0.001;
    await this.signerContract.approve(this.ownerAddress, ethers.parseUnits(approveAmount.toString(), this.decimals));
    expect((await this.testErcToken.allowance(this.recipientAddress, this.ownerAddress))).to.equal(ethers.parseUnits(approveAmount.toString(), this.decimals));
  });

  it('Emits an approval event with the right arguments', async function () {
    const approveAmount = 0.005;
    await expect(this.signerContract.approve(this.ownerAddress, ethers.parseUnits(approveAmount.toString(), this.decimals)))
        .to.emit(this.testErcToken, "Approval")
        .withArgs(this.recipientAddress, this.ownerAddress, ethers.parseUnits(approveAmount.toString(), this.decimals))
  }); 

  it('Allows an approved spender to transfer from owner', async function () {
    const transferAmount = 0.005;
    await this.testErcToken.transfer(this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
    await this.signerContract.approve(this.ownerAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
    await expect(this.testErcToken.transferFrom(this.recipientAddress, this.ownerAddress, transferAmount)).to.changeTokenBalances(
        this.testErcToken,
        [this.ownerAddress, this.recipientAddress],
        [transferAmount, -transferAmount]
      );
  });

  it('Emits a transfer event with the right arguments when conducting an approved transfer', async function () {
    const transferAmount = 0.005;
    await this.testErcToken.transfer(this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
    await this.signerContract.approve(this.ownerAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
    await expect(this.testErcToken.transferFrom(this.recipientAddress, this.ownerAddress, ethers.parseUnits(transferAmount.toString(), this.decimals)))
        .to.emit(this.testErcToken, "Transfer")
        .withArgs(this.recipientAddress, this.ownerAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
  });

//   it('Allows allowance to be increased and queried', async function () {
//     const initialAmount = 100;
//     const incrementAmount = 10000;
//     await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
//     const previousAllowance = await this.funToken.allowance(this.recipientAddress, this.ownerAddress);
//     await this.signerContract.increaseAllowance(this.ownerAddress, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals));
//     const expectedAllowance = ethers.BigNumber.from(previousAllowance).add(ethers.BigNumber.from(ethers.utils.parseUnits(incrementAmount.toString(), this.decimals)))
//     expect((await this.funToken.allowance(this.recipientAddress, this.ownerAddress))).to.equal(expectedAllowance);
//   });

//   it('Emits approval event when alllowance is increased', async function () {
//     const incrementAmount = 10000;
//     await expect(this.signerContract.increaseAllowance(this.ownerAddress, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals)))
//         .to.emit(this.funToken, "Approval")
//         .withArgs(this.recipientAddress, this.ownerAddress, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals))
//   });

//   it('Allows allowance to be decreased and queried', async function () {
//     const initialAmount = 100;
//     const decrementAmount = 10;
//     await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
//     const previousAllowance = await this.funToken.allowance(this.recipientAddress, this.ownerAddress);
//     await this.signerContract.decreaseAllowance(this.ownerAddress, ethers.utils.parseUnits(decrementAmount.toString(), this.decimals));
//     const expectedAllowance = ethers.BigNumber.from(previousAllowance).sub(ethers.BigNumber.from(ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
//     expect((await this.funToken.allowance(this.recipientAddress, this.ownerAddress))).to.equal(expectedAllowance);
//   });

//   it('Emits approval event when alllowance is decreased', async function () {
//     const initialAmount = 100;
//     const decrementAmount = 10;
//     await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
//     const expectedAllowance = ethers.BigNumber.from(ethers.utils.parseUnits(initialAmount.toString(), this.decimals)).sub(ethers.BigNumber.from(ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
//     await expect(this.signerContract.decreaseAllowance(this.ownerAddress, ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
//         .to.emit(this.funToken, "Approval")
//         .withArgs(this.recipientAddress, this.ownerAddress, expectedAllowance)
//   });

});