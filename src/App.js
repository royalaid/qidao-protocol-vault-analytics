import './index.css';
import './App.css';
import {useWeb3React, Web3ReactProvider} from '@web3-react/core'
import {ethers} from "ethers";
import {InjectedConnector} from '@web3-react/injected-connector';
import VaultABI from "./vaultAbi.json";

import React, {useState} from "react";

const injected = new InjectedConnector();

const ERC20Abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

const camWBTCToken = "0xBa6273A78a23169e01317bd0f6338547F869E8Df";
const WBTCToken = "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6";


function VaultDisplay(props){
  let {Provider, Label, VaultAddress, TokenAddress} = props;
  let [bal, setBal] = useState("0");
  let [earnings, setEarnings] = useState("0");
  let token = null, vault = null;
  if(VaultAddress !== "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1"){
    token = new ethers.Contract(TokenAddress, ERC20Abi, Provider);
  }

  if(VaultAddress && VaultAddress !== ""){
    vault = new ethers.Contract(VaultAddress, VaultABI, Provider);
  }

  React.useEffect(() => {
    async function fetchBalance(){
      let tokDec =
        TokenAddress === camWBTCToken || TokenAddress === WBTCToken
          ? 8
          : 18
      let fmtFn = (amt) =>
        Number.parseFloat(ethers.utils.formatUnits(amt, tokDec)).toLocaleString()



      setEarnings(fmtFn(await vault.vaultCollateral(0)));


      if(!token && VaultAddress !== "")
        setBal(fmtFn((await Provider.getBalance(VaultAddress))));
      else if(token && TokenAddress !== "" ){
        let tokBal = await token.balanceOf(VaultAddress);
        setBal(fmtFn(tokBal))
      }
    }
    fetchBalance();
  }, [Provider, TokenAddress, VaultAddress, token, vault]);
  // Read-Only; By connecting to a Provider, allows:
  // - Any constant function
  // - Querying Filters
  // - Populating Unsigned Transactions for non-constant methods
  // - Estimating Gas for non-constant (as an anonymous sender)
  // - Static Calling non-constant methods (as anonymous sender)
  return (
    <>
      <td className="p-2">
        <label>{Label}</label>
      </td>
      <td className="p-2">
        <span>{bal}</span>
      </td>
      <td className="p-2">
        <span>{earnings}</span>
      </td>
    </>)
}


function Home(props) {
  const {Label, VaultAddress, TokenAddress} = props;
  const { active, account, library} = useWeb3React()
  return (
    <tr>
      {active
        ? <VaultDisplay Provider={library} Account={account}
                        TokenAddress={TokenAddress}
                        VaultAddress={VaultAddress} Label={Label}/>
        : <span>Not connected</span>}
    </tr>
  )
}

function App() {
  const {library, connector, activate, deactivate } = useWeb3React()

  async function connect() {
    try {
      await activate(injected)
      console.log({library,  connector})
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  let vaults = [
    {
      l: "WETH",
      v: "0x3fd939B017b31eaADF9ae50C7fF7Fa5c0661d47C",
      t: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
    },
    {
      l: "LINK",
      v: "0x61167073E31b1DAd85a3E531211c7B8F1E5cAE72",
      t: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"
    },
    {
      l: "AAVE",
      v: "0x87ee36f780ae843A78D5735867bc1c13792b7b11",
      t: "0xd6df932a45c0f255f85145f286ea0b292b21c90b"
    },
    {
      l: "CRV",
      v: "0x98B5F32dd9670191568b661a3e847Ed764943875",
      t: "0x172370d5cd63279efa6d502dab29171933a610af"
    },
    {
      l: "BAL",
      v: "0x701A1824e5574B0b6b1c8dA808B184a7AB7A2867",
      t: "0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3"
    },
    {
      l: "dQuick",
      v: "0x649Aa6E6b6194250C077DF4fB37c23EE6c098513",
      t: "0xf28164a485b0b2c90639e47b0f377b4a438a16b1"
    },
    {
      l: "WBTC",
      v: "0x37131aEDd3da288467B6EBe9A77C523A700E6Ca1",
      t: WBTCToken
    },
    {
      l: "GHST",
      v: "0xF086dEdf6a89e7B16145b03a6CB0C0a9979F1433",
      t: "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7"
    },
    {
      l: "camWMATIC",
      v: "0x88d84a85A87ED12B8f098e8953B322fF789fCD1a",
      t: "0x7068Ea5255cb05931EFa8026Bd04b18F3DeB8b0B"
    },
    {
      l: "camWETH",
      v: "0x11A33631a5B5349AF3F165d2B7901A4d67e561ad",
      t: "0x0470CD31C8FcC42671465880BA81D631F0B76C1D"
    },
    {
      l: "camAAVE",
      v: "0x578375c3af7d61586c2C3A7BA87d2eEd640EFA40",
      t: "0xeA4040B21cb68afb94889cB60834b13427CFc4EB"
    },
    {
      l: "camWBTC",
      v: "0x7dda5e1a389e0c1892caf55940f5fce6588a9ae0",
      t: camWBTCToken
    },
    {
      l: "camDAI",
      v: "0xD2FE44055b5C874feE029119f70336447c8e8827",
      t: "0xE6C23289Ba5A9F0Ef31b8EB36241D5c800889b7b"
    }
  ]


  return (
      <div className="App">
        <header className="App-header">
          <div className="flex">
            <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>
            <button onClick={disconnect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Disconnect</button>
          </div>
          <table className="text-right">
            <th/>
            <th className="p-3">Total Deposits</th>
            <th className="p-3">Retained Earnings</th>
            <Home Label="MATIC" VaultAddress="0xa3Fa99A148fA48D14Ed51d610c367C61876997F1"/>
            {vaults.map((vaultInfo) =>
              <Home Label= {vaultInfo.l}
                    VaultAddress= {vaultInfo.v}
                    TokenAddress= {vaultInfo.t}
              />)}
          </table>
        </header>
      </div>
  );
}

function getLibrary(provider, _) {
  return new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

function WrappedApp(){
  return(
    <Web3ReactProvider getLibrary={getLibrary}>
      <App/>
    </Web3ReactProvider>
)
}

export default WrappedApp;
