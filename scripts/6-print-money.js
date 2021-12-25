import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0xB51B51BBDcfEc95af4fb5a32Fa32FB1EC7dbBbc2"
);

(async () => {
  try {
    const amount = 1_000_000;
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();
    console.log(
      "✅ There now is",
      ethers.utils.formatUnits(totalSupply, 18),
      "$CHM in circulation"
    );
  } catch (error) {
    console.error("Faiked to print money", error);
  }
})();
