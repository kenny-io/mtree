import keccak256 from "keccak256";
import { MerkleTree } from 'merkletreejs';

const whitelistedEmails = [
  'email1@example.com',
  'email2@example.com',
  'email3@example.com',
];

// Hash the emails
const leafNodes = whitelistedEmails.map((email) => keccak256(email).toString('hex'));

// Build the Merkle Tree
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
});

// Get the Merkle Root
const rootHash = merkleTree.getRoot().toString('hex');

// Generate Merkle Proof
function generateMerkleProof(email) {
  const hashedEmail = keccak256(email).toString('hex');
  const proof = merkleTree
    .getProof(hashedEmail)
    .map((x) => x.data.toString('hex'));
  return proof;
}

// Example: Generating a Merkle Proof for an email
const emailToVerify = 'email2@example.com';
const proofForEmail1 = generateMerkleProof(emailToVerify);
console.log(`Merkle Proof for ${emailToVerify}:`, proofForEmail1);

