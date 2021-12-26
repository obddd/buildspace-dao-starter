import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

import dotenv from "dotenv";
dotenv.config();

const voteModule = sdk.getVoteModule(
  "0x3055D5101B6b37a19DD461972406E57FaA79451d"
);
const tokenModule = sdk.getTokenModule(
  "0x9e38428b3127C4C43C692a5F234688EAD13A0309"
);

(async () => {
  // try {
  //   const amount = 420_000;
  //   voteModule.propose(
  //     "Should the DAO mint an additional " +
  //       amount +
  //       " tokens into the treasury?",
  //     [
  //       {
  //         // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
  //         // to send in this proposal.
  //         nativeTokenValue: 0,
  //         transactionData: tokenModule.contract.interface.encodeFunctionData(
  //           "mint",
  //           [voteModule.address, ethers.utils.parseUnits(amount.toString(), 18)]
  //         ),
  //         toAddress: tokenModule.address,
  //       },
  //     ]
  //   );

  //   console.log("✅ Successfully created proposal to mint tokens");
  // } catch (error) {
  //   console.error("failed to create first proposal", error);
  //   process.exit(1);
  // }
  try {
    const amount = 6_900;
    // Create proposal to transfer ourselves 6,900 tokens for being awesome.
    await voteModule.propose(
      "Should the DAO transfer " +
        amount +
        " tokens from the treasury to " +
        process.env.WALLET_ADDRESS +
        " for being awesome?",
      [
        {
          // Again, we're sending ourselves 0 ETH. Just sending our own token.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // We're doing a transfer from the treasury to our wallet.
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),

          toAddress: tokenModule.address,
        },
      ]
    );

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
