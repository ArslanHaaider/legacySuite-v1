import legacy from "../contracts/legacy";
import { Horizon, Transaction, XdrLargeInt } from "@stellar/stellar-sdk";
import { getPublicKey, signTransaction } from "@stellar/freighter-api";
import { useEffect, useState } from "react";
import { Address } from "@stellar/stellar-sdk";
import { legacyContract } from "../../packages/legacy/contractClass";
import {
  BASE_FEE,
  Contract,
  Networks,
  ScInt,
  StrKey,
  SorobanRpc,
  TransactionBuilder,
  nativeToScVal,
  xdr,
  Account,
} from "@stellar/stellar-sdk";

const AddAsset = () => {
  const [assets, setAssets] = useState([{ asset: "", amount: "" }]);
  const [benificiaryAddress, setBenificiaryAddress] = useState("");
  useEffect(() => {
    const accountInfo = async () => {
      const server = new Horizon.Server("https://horizon-testnet.stellar.org/", {
      });
      const account = await server.loadAccount("GDZDWPRWGMAVTNWBERD667PQ3BPCGIHEFQET6RRI4MZUS77ASHJMPT7B");
      let amountLimit = parseInt(account.balances[0].balance);
      console.log(account.balances);
    };
    accountInfo();
  }, []);
  const handleValue = (index, e) => {
    const newAssets = [...assets];
    newAssets[index][e.target.name] = e.target.value;
    setAssets(newAssets);
  };

  const handleAmount = (index, e) => {
    const newAssets = [...assets];
    newAssets[index].amount = e.target.value;
    setAssets(newAssets);
  };

  const handleBenificaryAddress = (e) => {
    setBenificiaryAddress(e.target.value);
  };

  const addAssetSection = () => {
    setAssets([...assets, { asset: "", amount: "" }]);
    console.log(assets);
  };

  const removeAssetSection = (index) => {
    const newAssets = [...assets];
    newAssets.splice(index, 1);
    setAssets(newAssets);
  };

  const add_Multiple = async () => {
    const data = assets.map((assetEntry) => {
      return {
        token: new Address(assetEntry.asset),
        benificary: new Address(benificiaryAddress),
        value: new XdrLargeInt(
          "i128",
          parseInt(assetEntry.amount) * 1000000
        ).toBigInt(),
      };
    });

    let publicKey = await getPublicKey();
    const contractAddress =
      "CDU6NSPK57UDMWGOCBQLPSHGCKC3RDEE527JNVOOUYNCYPYLWL7VGWCB";
    const userAccount = new Address(publicKey);
    const server = new SorobanRpc.Server(
      "https://soroban-testnet.stellar.org:443",
      {
        allowHttp: true,
      }
    );
    const myContract = new legacyContract(contractAddress);
    const operation = myContract.add_multiple(data, userAccount);
    const sourceAccount = await server.getAccount(publicKey);

    const builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(100)
      .build();

    const simulatedTx = await server.simulateTransaction(builtTransaction);
    const assembledTx = SorobanRpc.assembleTransaction(
      builtTransaction,
      simulatedTx
    ).build();

    const transaction = await signTransaction(
      assembledTx.toEnvelope().toXDR("base64"),
      {
        networkPassphrase: Networks.TESTNET,
      }
    );
    const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, "base64");
    const send = await server.sendTransaction(
      new Transaction(txEnvelope, Networks.TESTNET)
    );
    console.log(send.status);
  };

  return (
    <div className="min-w-1/2 min-h-1/2 max-w-full max-h-full bg-gray-800 border border-red-300 flex flex-col justify-between items-center rounded-md p-4 space-y-4">
      <div className="flex flex-col w-3/4">
        <label htmlFor="benificiary">Add Benificiary Address</label>
        <input
          type="text"
          onChange={handleBenificaryAddress}
          className="input input-primary bg-slate-900 h-10"
        />
      </div>
      {assets.map((assetEntry, index) => (
        <div
          key={index}
          className="flex w-3/4 justify-between mt-2 items-center"
        >
          <div>
            <label htmlFor={`asset-${index}`}>Choose an Asset:</label>
            <select
              name="asset"
              id={`asset-${index}`}
              value={assetEntry.asset}
              onChange={(e) => handleValue(index, e)}
              className="bg-slate-900 w-28 h-8 rounded-md"
            >
              <option value="">Select an asset</option>
              <option
                className="bg-slate-900 w-28 h-8 rounded-md"
                value="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
              >
                XLM
              </option>
              <option value="CA2E53VHFZ6YSWQIEIPBXJQGT6VW3VKWWZO555XKRQXYJ63GEBJJGHY7">
                USDC
              </option>
            </select>
          </div>
          <div>
            <label htmlFor={`amount-${index}`}>Add amount</label>
            <input
              type="text"
              id={`amount-${index}`}
              value={assetEntry.amount}
              onChange={(e) => handleAmount(index, e)}
              className="input input-primary bg-slate-900 h-10"
            />
          </div>
          <button
            className="btn btn-danger ml-2"
            onClick={() => removeAssetSection(index)}
          >
            x
          </button>
        </div>
      ))}
      <button className="btn btn-secondary mt-4" onClick={addAssetSection}>
        +
      </button>
      <button className="btn btn-primary mt-4" onClick={add_Multiple}>
        Add benificary
      </button>
    </div>
  );
};

export default AddAsset;
