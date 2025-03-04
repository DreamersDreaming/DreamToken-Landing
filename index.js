import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [fundingAmount, setFundingAmount] = useState("0");
  const [status, setStatus] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        setStatus("Wallet connected");
      } catch (error) {
        setStatus("Connection failed");
      }
    } else {
      setStatus("Please install MetaMask");
    }
  }

  async function contribute() {
    if (!walletAddress) {
      setStatus("Connect your wallet first");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "0xYourFundraisingWalletAddress", // Replace with your actual fundraising wallet address
        value: ethers.utils.parseEther(fundingAmount),
      });
      await tx.wait();
      setStatus("Contribution successful");
    } catch (error) {
      setStatus("Transaction failed");
    }
  }

  return (
    <div className="flex flex-col items-center p-10 space-y-6">
      <h1 className="text-4xl font-bold">DreamToken Fundraising</h1>
      <p className="text-lg">Support DreamToken and be part of the journey!</p>
      <Button onClick={connectWallet} className="px-6 py-2 text-xl">
        {walletAddress ? "Connected" : "Connect Wallet"}
      </Button>
      <input
        type="number"
        placeholder="Enter ETH amount"
        className="p-2 border rounded"
        onChange={(e) => setFundingAmount(e.target.value)}
      />
      <Button onClick={contribute} className="px-6 py-2 text-xl">
        Contribute
      </Button>
      <p className="text-red-500">{status}</p>
    </div>
  );
}
