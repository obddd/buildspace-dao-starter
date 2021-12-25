import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0x59df4191Cb2A9224A6b9692b5e2F221772447F6f");
(async () => {
  try {
    const tokenModule = await app.deployTokenModule({
      name: "Cheems Governance Token",
      symbol: "CHM",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
