# Understanding Merkle Proofs

A Merkle Proof is a way to prove that a piece of data is included in a large dataset without revealing the entire dataset. It derives its functionality from the Merkle tree, a type of data structure that allows for efficient and secure verification of content in larger datasets. To better understand how Merkle Proofs work, we need a good understanding of its foundations in the Merkle Tree.

## Merkle Tree

A Merkle Tree is a binary tree where each leaf node represents a block of data (for instance, a transaction) and each non-leaf node is a [hash](https://en.wikipedia.org/wiki/Hash_function) of its child nodes.

![Merkle Tree Diagram](/assets/merkle.png)

In a Merkle tree, data is organized into groups and each group is hashed together to create a unique hash value. Then, these hash values are further grouped and hashed again until there is only one hash value left — the root hash, which is the unique fingerprint that represents all the data in the Merkle Tree.

To better exemplify this, consider the diagram below:

![Merkle Tree with Hash values](/assets/mtree.png)

At the bottom of the diagram, you see `T1` to `T8`. They represent the leaf nodes of the Merkle tree, which contain the actual data, or in our case, transactions.

Each leaf node is hashed using a cryptographic hash function denoted by `h(1)`, `h(2)`, and so on. These hash functions transform the transaction data into a unique hash value that corresponds to the contents of the transaction.

The hash values of the leaf nodes are paired and hashed together to generate the hash values for the next layer of the tree, which are the branch nodes. For example, `h(T1)` is paired with `h(T2)` to create `h(1,2)`, and `h(T3)` is paired with `h(T4)` to create `h(3,4)`, and so on. This process is repeated until there is only one hash left — The Merkle Root.

The Merkle Root is at the top of the tree and represents the hash of all the underlying transactions. In the diagram, `h(1,2,3,4,5,6,7,8)` is the Merkle Root which is the single hash that summarizes the entire set of transactions in the tree. But how does this help us prove the existence of a transaction in the tree? This is where Merkle Proofs come in.

## Merkle Proof

In the scenario we depicted with the diagram, a Merkle Proof allows you to prove that a particular transaction is included in a block without revealing all the transactions in the block. For example, to prove that `T2` is part of the Merkle Tree, you would only need to provide `h(T2)`, `h(T1)`, `h(3,4)`, and `h(5,6,7,8)` along with the Merkle Root.

The verifier can hash `h(T2)` and `h(T1)` to verify `h(1,2)`, then hash the resulting value with `h(3,4)` to verify `h(1,2,3,4)`, and finally hash `h(1,2,3,4)` with `h(5,6,7,8)` to verify that it matches the Merkle Root. If the computed root matches the known Merkle Root, the proof is valid.

The process is fast and secure and enables efficient verification of data in large datasets. The Merkle Tree guarantees that any change in the data will result in a different Merkle Root, which is a crucial aspect of ensuring the integrity of data in the entire tree. As a proof of concept, let’s walkthrough a scenario where we are required to whitelist three email addresses.

### Whitelisting Email Addresses

We can whitelist three email addresses by creating a Merkle Tree of the email addresses and providing a proof that a specific email address is included in the tree. This proof would consist of the specific email address, along with the relevant nodes from the tree that are hashed together to build up the Merkle Root.

By comparing the computed root value against the provided root value, we can confirm whether the email address is included in the Merkle Tree or not.

Here's a JavaScript implementation to create a Merkle Tree for our whitelist and generate a Merkle Proof for the email address.

```jsx
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const whitelistedEmails = [
  "email1@example.com",
  "email2@example.com",
  "email3@example.com",
];

// Hash the emails
const leafNodes = whitelistedEmails.map((email) =>
  keccak256(email).toString("hex")
);

// Build the Merkle Tree
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
});

// Get the Merkle Root
const rootHash = merkleTree.getRoot().toString("hex");

// Generate Merkle Proof
function generateMerkleProof(email) {
  const hashedEmail = keccak256(email).toString("hex");
  const proof = merkleTree
    .getProof(hashedEmail)
    .map((x) => x.data.toString("hex"));
  return proof;
}

// Example: Generating a Merkle Proof for an email
const emailToVerify = "email2@example.com";
const proofForEmail1 = generateMerkleProof(emailToVerify);
console.log(`Merkle Proof for ${emailToVerify}:`, proofForEmail1);

/**
  Merkle Proof for email2@example.com: [
  '99a4577e6035242eaa3b9ce86c5a45b43a94073fc5dbb1378a112912f2757b3f',
  '332a04f7f8db0f8dcd3aaefc0c19e7b6b639246074a6e50e584b39ffa83c1ddc'
]
 */
```

In the code snippet above, we first import two packages to help us achieve the desired functionality.

- [keccak256](https://www.npmjs.com/package/keccak256) - For hashing the email addresses.
- [MerkleTree](https://www.npmjs.com/package/merkletreejs) - To create and work with the Merkle Tree.

As a first step in our implementation, we create the leaf nodes of the Merkle Tree by hashing the whitelisted email addresses using the `keccak256` JavaScript library.

Next, we create a new `MerkleTree` instance to construct the Merkle Tree. We provide it with the hashed email addresses, the `keccak256` hashing function and the `sortPairs` option which ensures consistency in the tree structure.

The `getRoot()` method of the `merkleTree` object is used to retrieve the Merkle Root hash, which represents the hash of all the whitelisted email addresses. Verifiers can use the root hash to verify that the hashed email addresses are indeed whitelisted.

Finally, we define a `generateMerkleProof()` function that takes an email address as input, hashes it using `keccak256` and then uses the `getProof()` method of the `merkleTree` object to generate a Merkle Proof for that email address. The proof is converted into an array of hexadecimal strings and returned.

The proof contains the minimum number of nodes required to reconstruct the path from the given email hash to the Merkle Root. To exemplify our implementation, we define a `proofForEmail` variable to generate a Merkle Proof for one of the whitelisted emails by passing it into the `generateMerkleProof()` function and logging the resulting value to the console for visibility.

### Conclusion

This tutorial demonstrates the basic implementation and utility of Merkle Proofs. We covered the Merkle Tree in detail to lay the foundation for a better understanding of Merkle Proofs. We also demonstrated how these concepts can be applied in practice to whitelist three email addresses in a JavaScript project.
