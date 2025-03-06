import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import tokenList from './tokenList.json';
import moment from 'moment-timezone';

import Factory from './abi/OptionFactory_metadata.json';
const abi = Factory.output.abi;

interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

const OptionCreator = (
  {baseContractAddress}: 
  {baseContractAddress: Address}
) => {
  const {isConnected,} = useAccount();  

  // State management
  const [collateralTokenSymbol, setCollateralToken] = useState<Token>();
  const [considerationTokenSymbol, setConsiderationToken] = useState<Token>();
  const [strikePrice, setStrikePrice] = useState<number >(0);
  const [isPut, setIsPut] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date>();
  
  const {writeContract } = useWriteContract()

  // Create a map of all tokens for easy lookup
  const allTokensMap = tokenList.reduce((acc, token) => {
    acc[token.symbol] = token;
    return acc;
  }, {} as Record<string, Token>);

  const collateral = collateralTokenSymbol ? allTokensMap[collateralTokenSymbol.symbol] : null;
  const consideration = considerationTokenSymbol ? allTokensMap[considerationTokenSymbol.symbol] : null;

  // The strike price is actually represented as an integer with 18 decimals like erc20 tokens. 
  const calculateStrikeRatio = () => {
    if (!strikePrice || !consideration || !collateral) return {strikeInteger: BigInt(0)};
    return {strikeInteger: BigInt(strikePrice * Math.pow(10, 18 + consideration.decimals - collateral.decimals)),};
  };

  const handleCreateOption = async () => {
    if (!collateral || !consideration || !strikePrice || !expirationDate) {
      alert('Please fill in all fields');
      return;
    }

    const { strikeInteger } = calculateStrikeRatio();
    const expTimestamp = Math.floor(new Date(expirationDate).getTime() / 1000);
    const date = new Date(expirationDate);
    const fmtDate = moment(date).format('YYYYMMDD');;
    // fix time to gmt
    
    // Generate option name and symbol
    const optionType = isPut ? 'P' : 'C';
    const baseNameSymbol = `OPT${optionType}-${collateral.symbol}-${consideration.symbol}-${fmtDate}-${strikePrice}`;
    const longName = `L${baseNameSymbol}`;
    const longSymbol = longName;
    const shortName = `S${baseNameSymbol}`;
    const shortSymbol = shortName;

    try {
      console.log(longName, longSymbol, collateral.address, consideration.address, BigInt(expTimestamp), strikeInteger, isPut);
      writeContract({
        address: baseContractAddress,
        abi,
        functionName: 'createOption',
        args: [
          longName,
          shortName,
          longSymbol,
          shortSymbol,
          collateral.address as Address,
          consideration.address as Address,
          BigInt(expTimestamp),
          strikeInteger,
          isPut
        ],
      });
    } catch (error) {
      console.error('Error creating option:', error);
      alert('Failed to create option. Check console for details.');
    }
  };

  moment.tz.setDefault("Europe/London");
  return (
    <div className="max-w-2xl mx-auto bg-black/80 border border-gray-800 rounded-lg shadow-lg p-6">
      <form className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-6 w-full">
          {/* Token Selection */}
          <div className="flex space-x-4 w-full">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collateral Token
              </label>
              <select
                className="w-full rounded-lg border border-gray-800 bg-black/60 text-blue-300 p-2"
                onChange={(e) => setCollateralToken(allTokensMap[e.target.value])}
              >
                <option value="">Select token</option>
                {Object.keys(allTokensMap).map(symbol => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strike Price
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-800 bg-black/60 text-blue-300 p-2"
                value={strikePrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStrikePrice(Number(e.target.value))}
                placeholder="Enter strike price"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consideration Token
              </label>
              <select
                className="w-full rounded-lg border border-gray-800 bg-black/60 text-blue-300 p-2"
                onChange={(e) => setConsiderationToken(allTokensMap[e.target.value])}
              >
                <option value="">Select token</option>
                {Object.keys(allTokensMap).map(symbol => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
            <p className="text-sm text-blue-200">
              {isPut 
                ? `This PUT option allows the holder to sell 1 ${consideration?.symbol || '[consideration]'} for ${strikePrice} ${collateral?.symbol || '[collateral]'}s before expiry.`
                : `This CALL option allows the holder to buy 1 ${collateral?.symbol || '[collateral]'} for ${strikePrice} ${consideration?.symbol || '[consideration]'}s before expiry.`
              }
            </p>
          </div>

          <div className="flex space-x-4 w-full items-end">
            {/* Option Type Switch */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Option Type
              </label>
              <button
                type="button"
                onClick={() => setIsPut(!isPut)}
                className={`relative inline-flex items-center w-24 h-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isPut ? 'bg-blue-600' : 'bg-blue-400'
                }`}
              >
                {/* Toggle Circle */}
                <span 
                  className={`absolute left-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out transform ${
                    isPut ? 'translate-x-16' : 'translate-x-0'
                  }`}
                />
                
                {/* Labels */}
                <span className="absolute left-2 text-xs font-bold text-white" style={{ opacity: isPut ? 0 : 1 }}>
                  CALL
                </span>
                <span className="absolute right-2 text-xs font-bold text-white" style={{ opacity: isPut ? 1 : 0 }}>
                  PUT
                </span>
              </button>
            </div>

            {/* Date Picker */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-800 bg-black/60 text-blue-300 p-2"
                onChange={(e) => setExpirationDate(new Date(e.target.value))}
              />
            </div>

            {/* Create Button */}
            <button
              className={`px-4 py-2 rounded-lg text-black transition-transform hover:scale-105 ${
                !isConnected || !collateral || !consideration || !strikePrice || !expirationDate
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={handleCreateOption}
              disabled={!isConnected || !collateral || !consideration || !strikePrice || !expirationDate}
            >
              Create Option
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default OptionCreator;