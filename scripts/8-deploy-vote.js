import sdk from "./1-initialize-sdk.js";

const appModule = sdk.getAppModule(
  "0x59df4191Cb2A9224A6b9692b5e2F221772447F6f"
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      name: "CheemDAO's Epic Proposals",
      votingTokenAddress: "0x9e38428b3127C4C43C692a5F234688EAD13A0309",
      proposalStartWaitTimeInSeconds: 0,
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: "0",
    });
    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address
    );
  } catch (error) {
    console.error("Failed to deploy vote module", error);
  }
})();
