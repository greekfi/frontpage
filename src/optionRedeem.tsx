import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import LongOptionABI from './abi/LongOption_metadata.json';
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
    <div className="p-4 bg-black/80 border border-gray-800 rounded-lg shadow-lg max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-light text-blue-300">
          <div className="flex items-center gap-1">
            Redeem Collateral
            <button
              type="button"
              className="text-sm text-blue-200 hover:text-blue-300 flex items-center gap-1"
              title="Redeem your collateral after option expiry"
              onClick={(e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'absolute bg-gray-900 text-sm text-gray-200 p-2 rounded shadow-lg -mt-8 -ml-2';
                tooltip.textContent = "Redeem your collateral after option expiry";
                
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

      <div className="flex flex-col gap-3 w-full">
        <input
          type="number"
          className="w-1/2 p-2 rounded-lg border border-gray-800 bg-black/60 text-blue-300"
          placeholder="Amount to redeem"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          min={0}
        />

        <div>
          <button
            className={`px-3 py-2 rounded-lg text-black transition-transform hover:scale-105 ${
              !amount || !isExpired || isPending
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleRedeem}
            disabled={!amount || !isExpired || isPending}
          >
            {isPending ? 'Processing...' : 'Redeem Collateral'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemInterface;