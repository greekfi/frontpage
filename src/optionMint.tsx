import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
// import { InputNumber, Button, Card, Space } from 'antd';
import { Address, parseUnits } from 'viem';

// Import ABIs and addresses
import LongOptionABI from './abi/LongOption_metadata.json';
import erc20abi from './erc20.abi.json';
import { useChainStore } from './config';

const longAbi = LongOptionABI.output.abi;


const MintInterface = (
  {optionAddress, shortAddress, collateralAddress, considerationAddress, collateralDecimals, considerationDecimals, isExpired}: 
  {optionAddress: Address, shortAddress: Address, collateralAddress: Address, considerationAddress: Address, collateralDecimals: number, considerationDecimals: number, isExpired: boolean}) => {

  const { currentChain } = useChainStore();
  const [amount, setAmount] = useState(0);
  const { address: userAddress } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [isPut, setIsPut] = useState(false);
  
  // Determine which token to use based on option type
  const [tokenToApprove, setTokenToApprove] = useState<Address>(collateralAddress);
  const [tokenDecimals, setTokenDecimals] = useState<number>(collateralDecimals);
  const [tokenLabel, setTokenLabel] = useState<string>("Collateral");

  // Check if the option is a PUT
  const { data: optionIsPut } = useReadContract({
    address: optionAddress as `0x${string}`,
    abi: longAbi,
    functionName: 'isPut',
    query: {
      enabled: !!optionAddress,
    },
  });

  // Update state when option type is determined
  useEffect(() => {
    if (optionIsPut !== undefined) {
      setIsPut(!!optionIsPut);
      
      if (optionIsPut) {
        // For PUT options, we use consideration tokens
        setTokenToApprove(considerationAddress);
        setTokenDecimals(considerationDecimals);
        setTokenLabel("Consideration");
      } else {
        // For CALL options, we use collateral tokens
        setTokenToApprove(collateralAddress);
        setTokenDecimals(collateralDecimals);
        setTokenLabel("Collateral");
      }
    }
  }, [optionIsPut, collateralAddress, considerationAddress, collateralDecimals, considerationDecimals]);

  const amountToMint = parseUnits(amount.toString(), Number(tokenDecimals));

  // Check allowance
  const { data: allowance = 0n } = useReadContract({
    address: tokenToApprove as `0x${string}`,
    abi: erc20abi,
    functionName: 'allowance',
    args: [userAddress as `0x${string}`, shortAddress as `0x${string}`],
    query: {
      enabled: !!tokenToApprove && !!userAddress,
    },
  });
  
  const isApproved = (allowance as bigint) >= amountToMint;

  console.log("shortAddress", shortAddress);
  console.log("isApproved", isApproved);
  console.log("allowance", allowance);
  console.log("amountToMint", amountToMint);
  console.log("current chain", currentChain.name);
  console.log("isPut", isPut);
  console.log("tokenToApprove", tokenToApprove);

  const handleApprove = async () => {
      const approveToken = {
        address: tokenToApprove as `0x${string}`,
        abi: erc20abi,
        functionName: 'approve',
        args: [shortAddress, amountToMint],
    };
    writeContract(approveToken);
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
    <div className="p-6 bg-black/80 border border-gray-800 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light text-blue-300">
          <div className="flex items-center gap-2">
            Mint {isPut ? "PUT" : "CALL"} Options
            <button
              type="button"
              className="text-sm text-blue-200 hover:text-blue-300 flex items-center gap-1"
              title={isPut 
                ? "This is a PUT option, so you'll need collateral tokens to mint."
                : "This is a CALL option, so you'll need consideration tokens to mint."
              }
              onClick={(e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'absolute bg-gray-900 text-sm text-gray-200 p-2 rounded shadow-lg -mt-8 -ml-2';
                tooltip.textContent = isPut 
                  ? "This is a PUT option, so you'll need collateral tokens to mint."
                  : "This is a CALL option, so you'll need consideration tokens to mint.";
                
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
          placeholder="Amount to Mint"
          value={amount || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              setAmount(0);
            } else {
              setAmount(Number(val));
            }
          }}
          min={0}
          step=".1"
        />

        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg text-black transition-transform hover:scale-105 ${
              !amount || isPending || isExpired
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={async () => {
              await handleApprove();
              handleMint();
            }}
            disabled={!amount || isPending || isExpired}
            title={isExpired ? "Option is expired" : ""}
          >
            {isPending ? 'Processing...' : `Mint Options`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintInterface;
