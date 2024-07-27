import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [transactions, setTransaction] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState("");

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    async function getBlock() {
      const response = await alchemy.core.getBlock(blockNumber);
      setBlock(response.hash);
    }
    async function getBlockWithTransactions() {
      const response = await alchemy.core.getBlockWithTransactions(blockNumber);

      setTransaction(response.transactions);
    }

    getBlockNumber();
    getBlock();
    getBlockWithTransactions();
  });

  return (
    <div className="App">
      <div>Block Number: {blockNumber}</div>
      <div>Block hash : {block}</div>
      <div>
        Block Tx :
        {selectedTransaction && (
          <div>
            <h3>Détails de la transaction</h3>
            <p>
              <strong>Hash:</strong> {selectedTransaction.hash} <br />
              <strong>From:</strong> {selectedTransaction.from} <br />
              <strong>To:</strong> {selectedTransaction.to} <br />
              <strong>
                Value:
              </strong> {selectedTransaction.value.toString()} <br />
              <strong>Nonce:</strong> {selectedTransaction.nonce} <br />
              <strong>Gas Price:</strong>{" "}
              {selectedTransaction.gasPrice.toString()} <br />
              <strong>Gas Limit:</strong>{" "}
              {selectedTransaction.gasLimit.toString()} <br />
              <strong>Block Number:</strong> {selectedTransaction.blockNumber}
            </p>
            <button onClick={() => setSelectedTransaction(null)}>Fermer</button>
          </div>
        )}
        {transactions.length === 0 ? (
          <div>Aucune transaction trouvée.</div>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.hash}>
                <button onClick={() => setSelectedTransaction(transaction)}>
                  {transaction.hash}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
