import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const contractsDir = resolve(root, 'frontend/src/lib/contracts')

const inputs = [
  ['CARTON_ABI', 'carton-abi.json'],
  ['PREDICTIONS_ABI', 'predictions-abi.json'],
  ['TREASURY_ABI', 'treasury-abi.json'],
  ['USDC_ABI', 'usdc-abi.json'],
]

const sections = inputs.map(([exportName, fileName]) => {
  const filePath = resolve(contractsDir, fileName)
  const json = JSON.parse(readFileSync(filePath, 'utf8'))
  return `export const ${exportName} = ${JSON.stringify(json, null, 2)} as const satisfies Abi`
})

const output = `import type { Abi } from 'viem'

// Generated from Forge ABI JSON exports. Do not edit by hand.

${sections.join('\n\n')}
`

writeFileSync(resolve(contractsDir, 'abis.ts'), output)
