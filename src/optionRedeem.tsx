import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
// import { InputNumber, Button, Card, Space } from 'antd';
import { Address, parseUnits } from 'viem';
import LongOptionABI from './abi/LongOption_metadata.json';
import TokenBalance from './optionTokenBalance';
import erc20abi from './erc20.abi.json';
const longAbi = LongOptionABI.output.abi;


interface RedeemInterfaceProps {
  shortAddress: `0x${string}`;
  collateralAddress: `0x${string}`;
  collateralDecimals: number;
  isExpired: boolean;
}

const RedeemInterface = ({
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
    await approveTransfers();

      // Prepare redeem transaction
      const redeemConfig = {
        address: shortAddress,
        abi: longAbi,
        functionName: 'redeem',
        args: [userAddress as `0x${string}`, parseUnits(amount.toString(), collateralDecimals)],
      };

      writeContract(redeemConfig);
      console.log(isExpired);
  };


  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Redeem Collateral</h2>
      <div className="flex flex-col gap-4 w-full">
        <TokenBalance
          userAddress={userAddress as `0x${string}`}
          tokenAddress={shortAddress as Address}
          label="Your Short Balance"
          decimals={collateralDecimals as number}
          watch={true}
        />

        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Amount to redeem"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          min={0}
        />

        <button
          className={`px-4 py-2 rounded-lg text-white ${
            !amount || !isExpired || isPending
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleRedeem}
          disabled={!amount || !isExpired || isPending}
        >
          {isPending ? 'Redeeming...' : 'Redeem Collateral'}
        </button>
      </div>
    </div>
  );
};

export default RedeemInterface;