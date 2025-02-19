import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
// import { InputNumber, Button, Card, Space } from 'antd';
import { Address, parseUnits } from 'viem';
import LongOptionABI from './abi/LongOption_metadata.json';
import TokenBalance from './optionTokenBalance';
import erc20abi from './erc20.abi.json';
const longAbi = LongOptionABI.output.abi;


interface RedeemInterfaceProps {
  optionAddress: `0x${string}`;
  shortAddress: `0x${string}`;
  collateralAddress: `0x${string}`;
  collateralDecimals: number;
  isExpired: boolean;
}

const RedeemPair = ({
  optionAddress: longOption,
  shortAddress,
  collateralAddress,
  collateralDecimals,
  isExpired,
}: RedeemInterfaceProps) => {
  const { address: userAddress } = useAccount();
  const [amount, setAmount] = useState<number>(0);
  const { writeContract, isPending, error } = useWriteContract();

  const approveTransfers = async () => {
    // First approve if needed
    const approveCollateral = {
      address: collateralAddress as `0x${string}`,
      abi: erc20abi,
      functionName: 'approve',
      args: [shortAddress, parseUnits(amount.toString(), Number(collateralDecimals))],
  };
  writeContract(approveCollateral);
    
    // Then exercise
    console.log(error);

};

  const handleRedeem = async () => {
    // await approveTransfers();

      // Prepare redeem transaction
      const redeemConfig = {
        address: longOption,
        abi: longAbi,
        functionName: 'redeem',
        args: [parseUnits(amount.toString(), collateralDecimals)],
        account: userAddress as `0x${string}`,
      };

      writeContract(redeemConfig);
      console.log(error);
  };


  return (
    <div className="p-6 bg-black/80 border border-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-light text-blue-300 mb-4">Redeem Collateral</h2>
      <div className="flex flex-col gap-4 w-full">
        <TokenBalance
          userAddress={userAddress as `0x${string}`}
          tokenAddress={longOption as Address}
          label="Your Long Balance"
          decimals={collateralDecimals as number}
          watch={true}
        />
        <TokenBalance
          userAddress={userAddress as `0x${string}`}
          tokenAddress={shortAddress as Address}
          label="Your Short Balance"
          decimals={collateralDecimals as number}
          watch={true}
        />

        <input
          type="number"
          className="w-full p-2 rounded-lg border border-gray-800 bg-black/60 text-blue-300"
          placeholder="Amount to redeem"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          min={0}
        />

        <button
          className={`px-4 py-2 rounded-lg text-black transition-transform hover:scale-105 ${
            !amount || isExpired || isPending
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={approveTransfers}
          disabled={!amount || isExpired || isPending}
        >
          {isPending ? 'Approving...' : 'Approve Transfers'}
        </button>

        <button
          className={`px-4 py-2 rounded-lg text-black transition-transform hover:scale-105 ${
            !amount || isPending
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleRedeem}
          disabled={!amount || isPending}
        >
          {isPending ? 'Redeeming...' : 'Redeem Collateral'}
        </button>
      </div>
    </div>
  );
};

export default RedeemPair;