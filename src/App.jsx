import React, { useState, useMemo } from "react";
import airdropData from "./data/airdropData.json";
import { hashLeaf, buildMerkleTree } from "./utils/merkle";

export default function App() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);
  const [claimed, setClaimed] = useState({});

  const { leavesMap } = useMemo(() => {
    const leavesMap = {};
    const leaves = airdropData.map((row) => {
      const leaf = hashLeaf(row.address, row.allocation);
      leavesMap[row.address.toLowerCase()] = { ...row, leaf };
      return leaf;
    });
    buildMerkleTree(leaves); // only building tree internally, root hidden
    return { leavesMap };
  }, []);

  const normalize = (a) => (a ? a.trim().toLowerCase() : "");

  const checkEligibility = () => {
    const addr = normalize(input);
    const entry = leavesMap[addr];

    if (!entry) {
      setStatus({ type: "no", text: "Not eligible for airdrop." });
      return;
    }

    const already = !!claimed[addr];
    setStatus({
      type: "yes",
      text: `Eligible — ${entry.allocation} ${entry.token}`,
      addr,
      allocation: entry.allocation,
      token: entry.token,
      leaf: entry.leaf,
      already,
    });
  };

  const claim = () => {
    if (!status || status.type !== "yes") return;
    const addr = status.addr;
    setClaimed((p) => ({ ...p, [addr]: true }));
    // Reset input and status after claiming
    setInput("");
    setStatus(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white rounded-xl shadow-md p-6 text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-blue-700">CATS Airdrop Checker</h1>

        <input
          placeholder="Enter your wallet address..."
          className="w-full border border-blue-200 px-3 py-2 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={checkEligibility}
          className="w-36 bg-amber-400 text-white p-2 rounded mb-4 hover:bg-amber-500 transition"
        >
          Check
        </button>

        <p className="text-xs text-slate-500 mb-2">
          Example adress: 0x5a15c81b48d017e62c5f75cebe70eeeeea00b5f2 
        </p>
        <p className="text-xs text-slate-500 mb-4">
          allocation: 67
        </p>

        {status && (
          <div
            className={`p-3 rounded ${
              status.type === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
            }`}
          >
            <p>{status.text}</p>
            {status.type === "yes" && !status.already && (
              <button
                onClick={claim}
                className="mt-2 px-3 py-1 rounded bg-blue-200 text-blue-800 hover:bg-blue-300 transition"
              >
                Claim (simulate)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
