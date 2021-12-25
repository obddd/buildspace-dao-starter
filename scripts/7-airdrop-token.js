import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const bundleDropModule = sdk.getBundleDropModule(
  "0x616b3164e44F169E0725eBf440A75bcFc4B951D9"
);

const tokenModule = sdk.getTokenModule(
  "0xB51B51BBDcfEc95af4fb5a32Fa32FB1EC7dbBbc2"
);

(async () => {
  try {
    const walletAddress = await bundleDropModule.getAllClaimerAddresses("0");

    if (walletAddress.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!"
      );
      process.exit(0);
    }
    const airdropTargets = walletAddress.map((address) => {
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);
      const airdropTarget = {
        address,
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };
      return airdropTarget;
    });
    console.log("🌈 Starting airdrop...");
    await tokenModule.transferBatch(airdropTargets);
    console.log(
      "✅ Successfully airdropped tokens to all the holders of the NFT!"
    );
  } catch (error) {
    console.error("Failed to airdrop tokens", error);
  }
})();
