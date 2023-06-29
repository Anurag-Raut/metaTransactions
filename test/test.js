const {expect} =require('chai')
const {BigNumber,utils} =require('ethers');
// const {arrayify,parseEther}=require('ethers/lib.commonjs/utils');
const {ethers}=require('hardhat');



describe("MetaTransfer",function(){
  it(" should let user tranfer tokens through a relayer",async function(){
    
    const tokenContract=await ethers.deployContract('Token',[]);
    // console.log('hello');
    // const  tokenContract=await tokenFactory.deploy();
    await tokenContract.waitForDeployment();
    console.log('deployed token address',tokenContract.target)
    const tokenTranferContract = await ethers.deployContract('TokenSender',[]);
    // const tokenTranferContract=await tokenSenderFactory.deploy();
    await tokenTranferContract.waitForDeployment();

    const [_,userAddress,relayerAddress,receiverAddress]=await ethers.getSigners();
    console.log(userAddress.address)
    const a=ethers.parseEther('10000');
    const b=ethers.parseEther('10')
    console.log(a);
    const mintTx=await tokenContract.connect(userAddress).freeMint(a);
    // await mintTx.wait();
    console.log(ethers.getBigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));

    const approveTxn=await tokenContract.connect(userAddress).approve(tokenTranferContract.target,ethers.getBigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));
    console.log('hemlu2')
    await approveTxn.wait();
    console.log('hemlu1')
    const messageHash=await tokenTranferContract.getHash(
      userAddress.address,
      receiverAddress.address,
      b,
      tokenContract.target
      
    )
    console.log('hemlu')
    
    const signature=await relayerAddress.signMessage(ethers.getBytes(messageHash));
    console.log(signature);
    const metaTxn=await tokenTranferContract.connect(relayerAddress
      ).transfer(
      userAddress.address,
      receiverAddress.address,
      b,
      tokenContract.target,
      signature
      
      
      )
      console.log('hello');

      await metaTxn.wait();

      const userBalance = await tokenContract.balanceOf(
        userAddress.address
      );

      const receiverBalance = await tokenContract.balanceOf(
        receiverAddress.address
      );
      console.log(userBalance);

      expect(userBalance<(a)).to.be.true;
      expect(receiverBalance>(ethers.getBigInt(0))).to.be.true;



    







    
  })




})