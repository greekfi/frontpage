import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
// import { InputNumber, Button, Card, Space } from 'antd';
import { Address, parseUnits } from 'viem';

// Import ABIs and addresses
import LongOptionABI from './abi/LongOption_metadata.json';
import erc20abi from './erc20.abi.json';
import TokenBalance from './optionTokenBalance';

const longAbi = LongOptionABI.output.abi;


const MintInterface = (
  {optionAddress, shortAddress, collateralAddress, collateralDecimals, isExpired}: 
  {optionAddress: Address, shortAddress: Address, collateralAddress: Address, collateralDecimals: number, isExpired: boolean}) => {


  const [amount, setAmount] = useState(0);
  const { address: userAddress } = useAccount();
  const amountToMint = parseUnits(amount.toString(), Number(collateralDecimals));
  const { writeContract, isPending } = useWriteContract();

  // Check allowance
  const { data: allowance = 0n } = useReadContract({
    address: collateralAddress as `0x${string}`,
    abi: erc20abi,
    functionName: 'allowance',
    args: [shortAddress as `0x${string}`],
    query: {
      enabled: !!collateralAddress,
    },
  });
  
  const isApproved = (allowance as bigint) >= amountToMint;

  console.log("shortAddress", shortAddress);
  console.log("isApproved", isApproved);
  console.log("allowance", allowance);
  console.log("amountToMint", amountToMint);

  const handleApprove = async () => {
      const approveCollateral = {
        address: collateralAddress as `0x${string}`,
        abi: erc20abi,
        functionName: 'approve',
        args: [shortAddress, amountToMint],
    };
    writeContract(approveCollateral);

  };
  const handleMint = async () => {
      handleApprove();
      // Then mint
      const mintConfig = {
        address: optionAddress as `0x${string}`,
        abi: longAbi,
        functionName: 'mint',
        args: [amountToMint],

      };
      
      writeContract(mintConfig);
  };

  return (
    <div className="p-6 bg-black/80 border border-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-light text-blue-300 mb-4">Mint Options</h2>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <TokenBalance
            userAddress={userAddress as `0x${string}`}
            tokenAddress={optionAddress as `0x${string}`}
            label="Your Option Balance"
            decimals={collateralDecimals as number}
            watch={true}
          />
          <TokenBalance
            userAddress={userAddress as `0x${string}`}
            tokenAddress={collateralAddress as `0x${string}`}
            label="Your Collateral Balance"
            decimals={collateralDecimals as number}
            watch={true}
          />
        </div>

        <input
          type="number"
          className="w-1/2 p-2 rounded-lg border border-gray-800 bg-black/60 text-blue-300"
          placeholder="Amount to Mint"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          min={0}
        />

        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg text-black transition-transform hover:scale-105 ${
              !amount || isPending || isApproved || isExpired
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleApprove}
            disabled={!amount || isPending || isApproved || isExpired}
          >
            {isPending ? 'Approving...' : 'Approve Collateral'}
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-black transition-transform hover:scale-105 ${
              !amount || isPending || isApproved || isExpired
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleMint}
            disabled={!amount || isPending || isApproved || isExpired}
          >
            {isPending ? 'Minting...' : 'Mint Options'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintInterface;
