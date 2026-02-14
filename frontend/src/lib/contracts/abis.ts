import type { Abi } from 'viem'

export const CARTON_ABI = [
  {
    type: 'function',
    name: 'cartonPrice',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'tokenPrices',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'acceptedTokens',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'activeTournamentId',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getUserTokens',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    type: 'function',
    name: 'buyCarton',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'buyCartonWithToken',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [],
  },
  {
    type: 'event',
    name: 'CartonPurchased',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'price', type: 'uint256' },
    ],
  },
] as const satisfies Abi

export const PREDICTIONS_ABI = [
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'teamsHash',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'teamsHashFrozen',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'totalGames',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'predictionsStarted',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'submissionDeadline',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'used',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'winnersPredictions',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'teams', type: 'uint8[4]' },
          { name: 'set', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'teams',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint8' }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'setTeamsHash',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'hash', type: 'bytes32' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'freezeTeamsHash',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'setSubmissionDeadline',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'deadline', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'setTotalGames',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'totalGames_', type: 'uint8' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'submitPrediction',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      {
        name: '_prediction',
        type: 'tuple[]',
        components: [
          { name: 'gameId', type: 'uint8' },
          { name: 'result', type: 'uint8[2]' },
        ],
      },
    ],
    outputs: [],
  },
] as const satisfies Abi

export const TREASURY_ABI = [
  {
    type: 'function',
    name: 'getPrizePool',
    stateMutability: 'view',
    inputs: [
      { name: 'tournamentId', type: 'uint256' },
      { name: 'token', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getUserPrizeAmount',
    stateMutability: 'view',
    inputs: [
      { name: 'tournamentId', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'position', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const satisfies Abi

export const USDC_ABI = [
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const satisfies Abi
