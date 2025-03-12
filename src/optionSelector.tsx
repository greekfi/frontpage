import { useReadContract, useReadContracts } from 'wagmi';
// import { Select, Card, Space } from 'antd';
import { Address, erc20Abi } from 'viem';


// Import ABIs and addresses
import OptionFactoryABI from './abi/OptionFactory_metadata.json';

const abi = OptionFactoryABI.output.abi;

const SelectOptionAddress = (
  {baseContractAddress, setOptionAddress}: 
  {baseContractAddress: Address, setOptionAddress: (address: Address) => void}
) => {

    const handleOptionChange = (optionAddress: string) => {
        setOptionAddress(optionAddress as Address);
    };

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
            className=" p-2 text-center rounded-lg border border-gray-800 bg-black/60 text-blue-300 w-64"
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

      </div>
    </div>
  );
};

export default SelectOptionAddress;
