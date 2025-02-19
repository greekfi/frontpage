import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
// import { InputNumber, Button, Card, Space, message } from 'antd';
import { parseUnits } from 'viem';
// import { useWriteContracts } from 'wagmi/experimental';

// Import ABIs and addresses
import LongOptionABI from './abi/LongOption_metadata.json';
import erc20abi from './erc20.abi.json';
import TokenBalance from './optionTokenBalance';

const longAbi = LongOptionABI.output.abi;

const addressA = "0xca81e41A3eDF50Ed0DF26B89DD7696eE61f4631a";
console.log(addressA);

const ExerciseInterface = ({
  optionAddress,
  shortAddress,
  collateralAddress,
  considerationAddress,
  collateralDecimals,
  considerationDecimals,
  isExpired,
}: {
  optionAddress: `0x${string}`;
  shortAddress: `0x${string}`;
  collateralAddress: `0x${string}`;
  considerationAddress: `0x${string}`;
  collateralDecimals: number;
  considerationDecimals: number;
  isExpired: boolean;
}) => {
  const [amount, setAmount] = useState(0);
  const { address: userAddress } = useAccount();

  // Check allowance
  // const { data: allowance = 0n } = useReadContract({
  //   address: considerationAddress as `0x${string}`,
  //   abi: erc20abi,
  //   functionName: 'allowance',
  //   args: [userAddress, optionAddress],
  // });

  const { writeContract, error, isPending } = useWriteContract();

  const handleExercise = async () => {
      // Then exercise
      const exerciseConfig = {
        address: optionAddress,
        abi: longAbi,
        functionName: 'exercise',
        args: [parseUnits(amount.toString(), Number(considerationDecimals))],
      };
      
      writeContract(exerciseConfig);

  };

  const approveTransfers = async () => {
      
      // First approve if needed
        const approveConsideration = {
          address: considerationAddress as `0x${string}`,
          abi: erc20abi,
          functionName: 'approve',
          args: [shortAddress, parseUnits(amount.toString(), Number(considerationDecimals))],
      };
      writeContract(approveConsideration);
      const approveCollateral = {
        address: collateralAddress as `0x${string}`,
        abi: erc20abi,
        functionName: 'approve',
        args: [shortAddress, parseUnits(amount.toString(), Number(collateralDecimals))],
    };
    writeContract(approveCollateral);
      
      // Then exercise
      console.log(error);
      // message.success('Options exercised successfully!');

  };

  return (
    <div className="p-6 bg-black/80 border border-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-light text-blue-300 mb-4">Exercise Options</h2>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <TokenBalance
            userAddress={userAddress as `0x${string}`}
            tokenAddress={optionAddress}
            label="Your Option Balance"
            decimals={collateralDecimals as number}
            watch={true}
          />
          <TokenBalance
            userAddress={userAddress as `0x${string}`}
            tokenAddress={considerationAddress as `0x${string}`}
            label="Your Consideration Balance"
            decimals={considerationDecimals as number}
            watch={true}
          />
        </div>

        <input
          type="number"
          className="w-full p-2 rounded-lg border border-gray-800 bg-black/60 text-blue-300"
          placeholder="Amount to exercise"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          min={0}
        />

        <div>
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
        </div>
        
        <div>
          <button
            className={`px-4 py-2 rounded-lg text-black transition-transform hover:scale-105 ${
              !amount || isExpired || isPending
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleExercise}
            disabled={!amount || isExpired || isPending}
          >
            {isPending ? 'Exercising...' : 'Exercise Options'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ExerciseInterface;