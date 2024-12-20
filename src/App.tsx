import Column from './assets/helmet-white.svg'
import './App.css'

function App() {

  return (
    <>
      <div className="flex-row h-screen bg-black p-0">
        <div className=" w-full px-10 top-0 left-0  bg-black">
          <div className="flex  items-center gap-4">
            <img src={Column} alt="Column SVG" className="size-20" />
            <h1 className="text-5xl font-thin font-sans text-blue-300">
              Greek.fi
            </h1>
            <div className="ml-auto">
              <button className="bg-blue-500 text-black px-4 mx-2 py-2 rounded-md">
                Trade
              </button>
              <button className="bg-blue-300 text-black px-4 mx-2 py-2 rounded-md">
                Mint
              </button>
              <button className="bg-blue-100 text-black px-4 mx-2 py-2 rounded-md">
                Vault
              </button>
            </div>
          </div>
        </div>
        <div className=" items-start  left-0 top-0 px-10 py-10">
          <p className="text-[clamp(2rem,8vw,9rem)] font-medium font-sans text-white">
            The only crypto options protocol on chain
          </p>
        </div>
        <div className="bg-blue-500  px-20 py-10">

          <span className="text-[clamp(2rem,5vw,5rem)] font-medium font-sans text-black">
            Start trading options on chain now
          </span>
          <button className="bg-black text-white px-4 mx-10 py-2 rounded-md">
            Trade Now
          </button>
        </div>

        <div className="flex-row bg-blue-300 px-20  py-10">
          <span className="text-[clamp(2rem,5vw,5rem)] font-medium font-sans text-black w-1/2">
            Mint options on chain now
          </span>
          <button className="bg-black text-white px-4 mx-10 py-2 rounded-md">
            Mint Now
          </button>
        </div>

        <div className=" bg-blue-100 px-20  py-10">
          <span className="text-[clamp(2rem,5vw,5rem)] font-medium font-sans text-black w-1/2">
            Use options Vaults on chain now
          </span>
          <button className="bg-black text-white px-4 mx-10 py-2 rounded-md">
            Vault Now
          </button>
        </div>
        <div className='bg-black px-20 py-10'>
          <h2 className='text-white text-[clamp(3rem,2vw,5rem)]'>
            Collateral based options
          </h2>
          <span className="text-[clamp(2rem,2vw,3rem)] font-medium font-sans text-white w-1/2">
            Greek.fi is a collateralized options protocol that allows anyone to mint 
            covered call and put options on chain by locking up collateral. No need
            for an oracle. No margin. No counterparty risk.
          </span>

        </div>
        <div className='bg-black px-20 py-10'>
          <h2 className='text-white text-[clamp(3rem,2vw,5rem)]'>
            What Collateral? Just ETH??
          </h2>
          <span className="text-[clamp(2rem,2vw,3rem)] font-medium font-sans text-white w-1/2">
            Any ERC20 collateral, this includes your staked tokens earning yield!
            stETH, sBTC, etc. See our supported tokens.
          </span>

        </div>
        <div className='bg-black px-20 py-10'>
        <h2 className='text-white text-[clamp(3rem,2vw,5rem)]'>
          Exercisable and redeemable
          </h2>
          <span className="text-[clamp(2rem,2vw,3rem)] font-medium font-sans text-white w-1/2">
            Once minted, the two sides of the option are represented through 2 ERC20 tokens, 
            the LONG option token and SHORT option token. The SHORT token allows the
            holder to redeem post expiration. The LONG token allows the holder to exercise 
            anytime before exiration, American style!
          </span>

        </div>
        <div className='bg-black px-20 py-10'>
        <h2 className='text-white text-[clamp(3rem,2vw,5rem)]'>
          Tradable
          </h2>
          <span className="text-[clamp(2rem,2vw,3rem)] font-medium font-sans text-white w-1/2">
            Options and SHORT tokens are tradable like any other ERC20 token.
            <a href="/trade" className='text-blue-300'> Trade </a> 
            them with our RFQ partners 
            <a href="https://0x.org" className='text-blue-300'> 0x</a> and  
            <a href="https://bebop.xyz" className='text-blue-300'> Bebop</a>!
          </span>

        </div>
        <div className='bg-black px-20 py-10'>
        <h2 className='text-white text-[clamp(3rem,2vw,5rem)]'>
          Want an ETF style way to earn yield through covered options?
          </h2>
          <span className="text-[clamp(2rem,2vw,3rem)] font-medium font-sans text-white w-1/2">
            Vault your collateral with us and we'll take care of selling the options for you.
            We work with our market makers to get the best yield on your investment.
          </span>

        </div>
      </div>
      {/* <div className='flex-row cent'>
        <div>
         © Greek Fi, 2024
        </div>

      </div> */}


    </>
  )
}

export default App
