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
          <p className="text-9xl font-medium font-sans text-white ">
            The only crypto options protocol on chain
          </p>
        </div>
        <div className="bg-blue-500  px-20 py-10">
        <span className="text-5xl font-medium font-sans text-black">
          Start trading options on chain now
        </span>
        <button className="bg-black text-white px-4 mx-10 py-2 rounded-md">
          Trade Now
        </button>
      </div>

      <div className="flex-row bg-blue-300 px-20  py-10">
        <span className="text-5xl font-medium font-sans text-black w-1/2">
          Mint options on chain now
        </span>
        <button className="bg-black text-white px-4 mx-10 py-2 rounded-md">
          Mint Now
        </button>
      </div>

      <div className=" bg-blue-100 px-20  py-10">
        <span className="text-5xl font-medium font-sans text-black w-1/2">
          Use options Vaults on chain now
        </span>
        <button className="bg-black text-white px-4 mx-10 py-2 rounded-md">
          Vault Now
        </button>
      </div>
      </div>
      <div>
    </div>
      
      
    </>
  )
}

export default App
