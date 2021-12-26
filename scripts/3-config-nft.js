import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xaBb27Eb2F9C8271dfdc0810cB51807F535042D1D"
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Real Cheems",
        description: "This NFT will give you access to CheemsDAO!",
        image: readFileSync("scripts/assets/cheems2.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
