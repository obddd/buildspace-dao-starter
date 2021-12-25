import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEffect, useState } from "react";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDrop = sdk.getBundleDropModule(
  "0x616b3164e44F169E0725eBf440A75bcFc4B951D9"
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  const signer = provider ? provider.getSigner() : undefined;
  const [isClaimingNFT, setIsClaimingNFT] = useState(false);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }
    return bundleDrop
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.log("failed to nft balance", error);
      });
  }, [address]);

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to CheemsDao</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          🥳 Connect your wallet!
        </button>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaimingNFT(true);
    bundleDrop
      .claim("0", 1)
      .catch((error) => {
        setIsClaimingNFT(false);
        console.log("failed to nft balance", error);
      })
      .finally(() => {
        setIsClaimingNFT(false);
        setHasClaimedNFT(true);
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDrop.address}/0`
        );
      });
  };
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  }
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button disabled={isClaimingNFT} onClick={() => mintNft()}>
        {isClaimingNFT ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
