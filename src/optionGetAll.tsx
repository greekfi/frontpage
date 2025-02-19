import { useAccount, useReadContract, useReadContracts } from 'wagmi';
// import { Select, Card, Space } from 'antd';
import { Address, erc20Abi } from 'viem';


// Import ABIs and addresses
import OptionFactoryABI from './abi/OptionFactory_metadata.json';
import TokenBalance from './optionTokenBalance';

const abi = OptionFactoryABI.output.abi;

const SelectOptionAddress = (
  {baseContractAddress, setOptionAddress, optionAddress, collateralAddress, collateralDecimals}: 
  {baseContractAddress: Address, setOptionAddress: (address: Address) => void, optionAddress: Address, collateralAddress: Address, collateralDecimals: number}
) => {

    const handleOptionChange = (optionAddress: string) => {
        setOptionAddress(optionAddress as Address);
    };

    const { address: userAddress } = useAccount();
  const { data: createdOptions, error } = useReadContract({
    address: baseContractAddress, 
    abi,
    functionName: 'getCreatedOptions',
  });

  console.log("createdOptions", createdOptions);
  console.log("error", error);

  const { data, error:error_ } = useReadContracts({
    contracts: (createdOptions as Address[] || []).map((option: Address) => (option?{
      address: option,
      abi: erc20Abi,
      functionName: 'name',
    }: undefined)).filter((option) => option !== undefined),
    query: {
      enabled: !!createdOptions,
    }
  }) ;
  const optionNames = data || [];
  // combine option names with options
  const optionList = (optionNames || []).map((option, index) => ({
    name: option.result,
    address: (createdOptions as Address[] || [])[index],
    
  }));

  console.log("error", error_);
  console.log("optionList", optionList);

  return (
    <div className="p-6 bg-black/80 border border-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-light text-blue-300 mb-4">Select Option</h2>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-center w-full">
          <select
            className="w-[400px] p-2 text-center rounded-lg border border-gray-800 bg-black/60 text-blue-300"
            onChange={(e) => handleOptionChange(e.target.value)}
          >
            <option value="">Select an option</option>
            {optionList.map((option) => (
              <option key={option.address} value={option.address || ''}>
                {String(option.name || '')}
              </option>
            ))}
          </select>
        </div>

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
      </div>
    </div>
  );
};

export default SelectOptionAddress;
