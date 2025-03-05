import { useState, useEffect } from 'react';
import { useWriteContract, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import erc20abi from './erc20.abi.json';
import LongOptionABI from './abi/LongOption_metadata.json';

const longAbi = LongOptionABI.output.abi;

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
  const [isPut, setIsPut] = useState(false);
  
  // Determine which token to use based on option type
  const [tokenToApprove, setTokenToApprove] = useState<`0x${string}`>(considerationAddress);
  const [tokenDecimals, setTokenDecimals] = useState<number>(considerationDecimals);
  const [, setTokenLabel] = useState<string>("Consideration");

  // Check if the option is a PUT
  const { data: optionIsPut } = useReadContract({
    address: optionAddress,
    abi: longAbi,
    functionName: 'isPut',
    query: {
      enabled: !!optionAddress,
    },
  });

  // Update state when option type is determined
  useEffect(() => {
    if (optionIsPut !== undefined) {
      setIsPut(Boolean(optionIsPut));
      
      if (optionIsPut) {
        // For PUT options, we use collateral tokens
        setTokenToApprove(collateralAddress);
        setTokenDecimals(collateralDecimals);
        setTokenLabel("Collateral");
      } else {
        // For CALL options, we use consideration tokens
        setTokenToApprove(considerationAddress);
        setTokenDecimals(considerationDecimals);
        setTokenLabel("Consideration");
      }
    }
  }, [optionIsPut, collateralAddress, considerationAddress, collateralDecimals, considerationDecimals]);

  const { writeContract, error, isPending } = useWriteContract();

  const handleExercise = async () => {
      // Then exercise
      const exerciseConfig = {
        address: optionAddress,
        abi: longAbi,
        functionName: 'exercise',
        args: [parseUnits(amount.toString(), Number(tokenDecimals))],
      };
      
      writeContract(exerciseConfig);
  };

  const approveTransfers = async () => {
      // Approve the token needed for exercise based on option type
      const approveToken = {
        address: tokenToApprove,
        abi: erc20abi,
        functionName: 'approve',
        args: [shortAddress, parseUnits(amount.toString(), Number(tokenDecimals))],
      };
      writeContract(approveToken);
      
      console.log(error);
  };

  return (
    <div className="p-6 bg-black/80 border border-gray-800 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light text-blue-300">
          <div className="flex items-center gap-2">
            Exercise {isPut ? "PUT" : "CALL"} Options
            <button
              type="button"
              className="text-sm text-blue-200 hover:text-blue-300 flex items-center gap-1"
              title={isPut 
                ? "This is a PUT option, so you'll need collateral tokens to exercise."
                : "This is a CALL option, so you'll need consideration tokens to exercise."
              }
              onClick={(e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'absolute bg-gray-900 text-sm text-gray-200 p-2 rounded shadow-lg -mt-8 -ml-2';
                tooltip.textContent = isPut 
                  ? "This is a PUT option, so you'll need collateral tokens to exercise."
                  : "This is a CALL option, so you'll need consideration tokens to exercise.";
                
                const button = e.currentTarget;
                button.appendChild(tooltip);
                
                setTimeout(() => {
                  tooltip.remove();
                }, 2000);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </button>
          </div>
        </h2>
      </div>
      
      <div className="flex flex-col gap-4 w-full">
        
        <input
          type="number"
          className="w-1/2 p-2 rounded-lg border border-gray-800 bg-black/60 text-blue-300"
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
            onClick={async () => {
              await approveTransfers();
              handleExercise();
            }}
            disabled={!amount || isExpired || isPending}
          >
            {isPending ? 'Processing...' : 'Exercise Options'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ExerciseInterface;