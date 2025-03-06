import { useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import LongOptionABI from './abi/LongOption_metadata.json';
import erc20abi from './erc20.abi.json';
import OptionInterface from './components/OptionInterface';

const longAbi = LongOptionABI.output.abi;

const MintInterface = ({
  optionAddress,
  shortAddress,
  collateralAddress,
  collateralDecimals,
  isExpired,
}: {
  optionAddress: `0x${string}`;
  shortAddress: `0x${string}`;
  collateralAddress: `0x${string}`;
  collateralDecimals: number;
  isExpired: boolean;
}) => {
  const { writeContract } = useWriteContract();

  const handleApprove = async () => {
    const approveToken = {
      address: collateralAddress as `0x${string}`,
      abi: erc20abi,
      functionName: 'approve',
      args: [shortAddress, parseUnits('0', Number(collateralDecimals))],
    };
    writeContract(approveToken);
  };

  return (
    <OptionInterface
      title="Mint Options"
      description="Mint new options by providing collateral"
      tokenAddress={collateralAddress}
      tokenDecimals={collateralDecimals}
      tokenLabel="Collateral Balance"
      contractAddress={optionAddress}
      contractAbi={longAbi}
      functionName="mint"
      isExpired={isExpired}
      onApprove={handleApprove}
      showApproveButton={true}
    />
  );
};

export default MintInterface;
