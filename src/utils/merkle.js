import { keccak256 } from "js-sha3";

export function hashLeaf(address, allocation) {
  return keccak256(address.toLowerCase() + allocation);
}


export function buildMerkleTree(leaves) {
  let layer = [...leaves];
  const layers = [layer];

  while (layer.length > 1) {
    const nextLayer = [];
    for (let i = 0; i < layer.length; i += 2) {
      if (i + 1 < layer.length) {
        nextLayer.push(keccak256(layer[i] + layer[i + 1]).toString("hex"));
      } else {
        nextLayer.push(layer[i]);
      }
    }
    layer = nextLayer;
    layers.push(layer);
  }

  return { root: layer[0], layers };
}
