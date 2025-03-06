import { useEffect, useState } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import erc20abi from './erc20.abi.json';
import LongOptionABI from './abi/LongOption_metadata.json';
import OptionInterface from './components/OptionInterface';

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
  const [tokenToApprove, setTokenToApprove] = useState<`0x${string}`>(considerationAddress);
  const [tokenDecimals, setTokenDecimals] = useState<number>(considerationDecimals);
  const { writeContract } = useWriteContract();

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
      if (optionIsPut) {
        // For PUT options, we use collateral tokens
        setTokenToApprove(collateralAddress);
        setTokenDecimals(collateralDecimals);
      } else {
        // For CALL options, we use consideration tokens
        setTokenToApprove(considerationAddress);
        setTokenDecimals(considerationDecimals);
      }
    }
  }, [optionIsPut, collateralAddress, considerationAddress, collateralDecimals, considerationDecimals]);

  const handleApprove = async () => {
    const approveToken = {
      address: tokenToApprove,
      abi: erc20abi,
      functionName: 'approve',
      args: [shortAddress, parseUnits('0', Number(tokenDecimals))],
    };
    writeContract(approveToken);
  };

  return (
    <OptionInterface
      title="Exercise Options"
      description="Exercise your options to receive the underlying asset"
      tokenAddress={considerationAddress}
      tokenDecimals={considerationDecimals}
      tokenLabel="Consideration Balance"
      contractAddress={optionAddress}
      contractAbi={longAbi}
      functionName="exercise"
      isExpired={isExpired}
      onApprove={handleApprove}
      showApproveButton={true}
    />
  );
};

export default ExerciseInterface;