import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount, WagmiProvider } from 'wagmi'
import RedeemPair from './optionRedeemPair';
import ExerciseInterface from './optionExercise';
import MintInterface from './optionMint';
import { Account } from './account';
import { WalletOptions } from './walletoptions';
import OptionCreator from './optionCreate';
import { Address } from 'viem';
import ContractDetails from './optionDetails';
import { useState } from 'react';
import SelectOptionAddress from './optionSelector';
import logo from './assets/helmet-white.svg';
import { config } from './config';
const CONTRACT_ADDRESS = '0xb55edadc4a09f380cd4229c4075b9f44e3405585'
const queryClient = new QueryClient()

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

function OptionsFunctions() {
  console.log("OptionsFunctions");
  // console.log(config);

  const [optionAddress, setOptionAddress] = useState<Address>("0x0");
  const [shortAddress, setShortAddress] = useState<Address>("0x0");
  const [collateralAddress, setCollateralAddress] = useState<Address>("0x0");
  const [considerationAddress, setConsiderationAddress] = useState<Address>("0x0");
  const [collateralDecimals, setCollateralDecimals] = useState<number>(0);
  const [considerationDecimals, setConsiderationDecimals] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <main className="flex-1">
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-6">
          <nav className="flex justify-between w-full">
            <ul className="flex items-center space-x-6">
              <li>
                <img src={logo} alt="Greek.fi" className="w-24 h-24" />
              </li>
              <li>
                <a href="/" className="hover:text-blue-500">About GreekFi</a>
              </li>
              <li>
                <a href="https://github.com/greekfi/whitepaper" className="hover:text-blue-500">Whitepaper</a>
              </li>
              <li>
                <a href="mailto:hello@greek.fi" className="hover:text-blue-500 text-blue-300">Contact</a>
              </li>
            </ul>
          </nav>


          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <div><ConnectWallet /></div>
              
              <div>
                <ContractDetails 
                  optionAddress={optionAddress}
                  setShortAddress={setShortAddress}
                  setCollateralAddress={setCollateralAddress}
                  setConsiderationAddress={setConsiderationAddress}
                  setCollateralDecimals={setCollateralDecimals}
                  setConsiderationDecimals={setConsiderationDecimals}
                  setIsExpired={setIsExpired}
                />
              </div>
              
              <div className="space-y-2">
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-800">
                    <SelectOptionAddress 
                      baseContractAddress={CONTRACT_ADDRESS} 
                      setOptionAddress={setOptionAddress}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800">
                    <MintInterface 
                      optionAddress={optionAddress} 
                      shortAddress={shortAddress} 
                      collateralAddress={collateralAddress} 
                      collateralDecimals={collateralDecimals} 
                      isExpired={isExpired} 
                    />
                    <ExerciseInterface 
                      optionAddress={optionAddress} 
                      shortAddress={shortAddress} 
                      collateralAddress={collateralAddress} 
                      considerationAddress={considerationAddress} 
                      collateralDecimals={collateralDecimals} 
                      considerationDecimals={considerationDecimals} 
                      isExpired={isExpired} 
                    />
                    <RedeemPair  
                      optionAddress={optionAddress} 
                      shortAddress={shortAddress} 
                      collateralAddress={collateralAddress} 
                      collateralDecimals={collateralDecimals} 
                      isExpired={isExpired} 
                    />
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-800">
                    <OptionCreator baseContractAddress={CONTRACT_ADDRESS} />
                  </div>
                </div>
              </div>
            </QueryClientProvider>
          </WagmiProvider>
        </div>

        <footer className="py-8 px-6 text-gray-200 bg-gray-700">
          <div id="about">
            {/* <p className="text-gray-200">
              Greek.fi provides the only option protocol on chain that collateralizes any 
            ERC20 token to a redeemable token and provides a fully on-chain option that is exercisable. 
            Both the collateral and the option are ERC20 tokens. 
            </p> */}
          </div>
          <span className="text-gray-500">Greek.fi © 2025</span>
        </footer>
      </main>
    </div>
  );
}

export default OptionsFunctions;