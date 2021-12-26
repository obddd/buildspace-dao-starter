import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

const voteModule = sdk.getVoteModule(
  "0x93AAA9629Bbf2CbC5a2655815a7Ce2dc560ad353"
);
const tokenModule = sdk.getTokenModule(
  "0xB51B51BBDcfEc95af4fb5a32Fa32FB1EC7dbBbc2"
);

(async () => {
  try {
    await tokenModule.grantRole("minter", voteModule.address);
    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
  } catch (error) {
    console.error(
      "failed to grant vote module permissions on token module",
      error
    );
    process.exit(1);
  }
  try {
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);
    await tokenModule.transfer(voteModule.address, percent90);

    console.log("✅ Successfully transferred tokens to vote module");
  } catch (error) {
    console.error("failed to transfer tokens to vote module", error);
  }
})();
