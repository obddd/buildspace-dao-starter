import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDrop = sdk.getBundleDropModule(
  "0x616b3164e44F169E0725eBf440A75bcFc4B951D9"
);
const tokenModule = sdk.getTokenModule(
  "0xB51B51BBDcfEc95af4fb5a32Fa32FB1EC7dbBbc2"
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    bundleDrop
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Members addresses", addresses);
        setMemberAddresses(addresses);
      })
      .catch((error) => {
        console.error("failed to get member list", error);
      });
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    tokenModule
      .getAllHolderBalances()
      .then((amount) => {
        console.log("👜 Amounts", amount);
        setMemberTokenAmounts(amount);
      })
      .catch((error) => {
        console.error("failed to get token amounts", error);
      });
  }, [hasClaimedNFT]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberTokenAmounts, memberAddresses]);

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
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
