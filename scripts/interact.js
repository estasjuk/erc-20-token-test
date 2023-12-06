const { ethers } = require("hardhat");

async function main() {
    console.log('Getting the testErc token contract...');
    const contractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
    const testErcToken = await ethers.getContractAt('TestErcToken', contractAddress);
    //console.log(testErcToken);
    console.log(await testErcToken.name());
    const symbol = await testErcToken.symbol()
    console.log(symbol);
    const decimals = await testErcToken.decimals()
    console.log(decimals);
    const totalSupply = await testErcToken.totalSupply();
    console.log(totalSupply);
    console.log(`Total Supply in TSTERC: ${ethers.formatUnits(totalSupply, decimals)}\n`);


    // balanceOf(address account)
    console.log('Getting the balance of contract owner...');
    const signers = await ethers.getSigners();
    const ownerAddress = signers[0].address;
    let ownerBalance = await testErcToken.balanceOf(ownerAddress);
    console.log(`Contract owner at ${ownerAddress} has a ${symbol} balance of ${ethers.formatUnits(ownerBalance, decimals)}\n`);

    // approve(address spender, uint256 amount)
    console.log(`Setting allowance amount of spender over the caller\'s ${symbol} tokens...`);
    const approveAmount = 0.001;
    console.log(`This example allows the contractOwner to spend up to ${approveAmount} of the recipient\'s ${symbol} token`);
    const signerContract = testErcToken.connect(signers[1]); // Creates a new instance of the contract connected to the recipient
    await signerContract.approve(ownerAddress, ethers.parseUnits(approveAmount.toString(), decimals));
    console.log(`Spending approved\n`);


    // transfer(to, amount)
    console.log('Initiating a transfer...');
    const recipientAddress = signers[1].address;
    const transferAmount = 0.01;
    console.log(`Transferring ${transferAmount} ${symbol} tokens to ${recipientAddress} from ${ownerAddress}`);
    await testErcToken.transfer(recipientAddress, ethers.parseUnits(transferAmount.toString(), decimals));
    console.log('Transfer completed');
    ownerBalance = await testErcToken.balanceOf(ownerAddress);
    console.log(`Balance of owner (${ownerAddress}): ${ethers.formatUnits(ownerBalance, decimals)} ${symbol}`);
    let recipientBalance = await testErcToken.balanceOf(recipientAddress);
    console.log(`Balance of recipient (${recipientAddress}): ${ethers.formatUnits(recipientBalance, decimals)} ${symbol}\n`);

    // allowance(address owner, address spender)
    console.log(`Getting the contracOwner spending allowance over recipient\'s ${symbol} tokens...`);
    let allowance = await testErcToken.allowance(recipientAddress, ownerAddress);
    console.log(`contractOwner Allowance: ${ethers.formatUnits(allowance, decimals)} ${symbol}\n`);


    // transferFrom(address from, address to, uint256 amount)
    const transferFromAmount = 0.0005;
    console.log(`contracOwner transfers ${transferFromAmount} ${symbol} from recipient\'s account into own account...`);
    await testErcToken.transferFrom(recipientAddress, ownerAddress, ethers.parseUnits(transferFromAmount.toString(), decimals));
    ownerBalance = await testErcToken.balanceOf(ownerAddress);
    console.log(`New owner balance (${ownerAddress}): ${ethers.formatUnits(ownerBalance, decimals)} ${symbol}`);
    recipientBalance = await testErcToken.balanceOf(recipientAddress);
    console.log(`New recipient balance (${recipientAddress}): ${ethers.formatUnits(recipientBalance, decimals)} ${symbol}`);
    allowance = await testErcToken.allowance(recipientAddress, ownerAddress);
    console.log(`Remaining allowance: ${ethers.formatUnits(allowance, decimals)} ${symbol}\n`);

};

function commify(value) {
    const match = value.match(/^(-?)([0-9]*)(\.?)([0-9]*)$/);
    if (!match || (!match[2] || !match[4])) {
      throw new Error(`bad formatted number: ${ JSON.stringify(value) }`);
    }
  
    const neg = match[1];
    const whole = BigInt(match[2] || 0).toLocaleString("en-us");
    const frac = match[4] ? match[4].match(/^(.*?)0*$/)[1]: "0";
    console.log(`${ neg }${ whole }.${ frac }`);
  
    return `${ neg }${ whole }.${ frac }`;
  }
  
  //commify("1234.5");

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });