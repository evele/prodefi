function includesAny(message: string, patterns: readonly string[]) {
  return patterns.some((pattern) => message.includes(pattern))
}

function mapSharedErrorMessage(message: string): string | null {
  if (!message) return null

  if (includesAny(message, ['user rejected', 'user denied', 'rejected the request'])) {
    return 'Transaction cancelled in wallet.'
  }

  if (message.includes('wallet not connected')) {
    return 'Connect your wallet to continue.'
  }

  if (message.includes('public client unavailable')) {
    return 'Could not reach the configured network. Try again.'
  }

  if (includesAny(message, ['wrong network', 'chain mismatch', 'chain disconnected', 'switch to chain'])) {
    return 'Wallet is connected to the wrong network.'
  }

  if (includesAny(message, ['insufficient funds', 'insufficient balance'])) {
    return 'Insufficient balance to pay for gas.'
  }

  if (includesAny(message, ['nonce too low', 'replacement transaction underpriced'])) {
    return 'Wallet nonce is out of sync. Retry the transaction.'
  }

  if (includesAny(message, ['execution reverted', 'contractfunctionexecutionerror'])) {
    return null
  }

  return null
}

export function extractErrorMessage(error: unknown): string {
  const messages: string[] = []
  const seen = new WeakSet<object>()

  const visit = (value: unknown) => {
    if (!value) return

    if (typeof value === 'string') {
      messages.push(value)
      return
    }

    if (typeof value !== 'object') return
    if (seen.has(value)) return
    seen.add(value)

    if (value instanceof Error && value.message) {
      messages.push(value.message)
    }

    const record = value as Record<string, unknown>

    for (const key of ['message', 'shortMessage', 'details']) {
      if (typeof record[key] === 'string') {
        messages.push(record[key] as string)
      }
    }

    if (Array.isArray(record.metaMessages)) {
      for (const item of record.metaMessages) {
        if (typeof item === 'string') {
          messages.push(item)
        }
      }
    }

    visit(record.cause)
  }

  visit(error)

  return Array.from(new Set(messages)).join(' | ')
}

function normalizeErrorMessage(error: unknown) {
  return extractErrorMessage(error).toLowerCase()
}

export function mapBuyCartonError(error: unknown): string {
  const message = normalizeErrorMessage(error)
  const shared = mapSharedErrorMessage(message)
  if (shared) return shared

  if (message.includes('eth purchase disabled')) {
    return 'Cartons can only be purchased with USDC.'
  }

  if (includesAny(message, ['price not set', 'token price not set'])) {
    return 'USDC price is not configured yet.'
  }

  if (message.includes('insufficient payment')) {
    return 'Cartons no longer accept native-token payments.'
  }

  if (message.includes('token not accepted')) {
    return 'USDC is not accepted right now.'
  }

  if (includesAny(message, ['erc20insufficientallowance', 'insufficient allowance'])) {
    return 'Approve USDC before buying.'
  }

  if (includesAny(message, ['erc20insufficientbalance', 'transfer amount exceeds balance', 'transfer failed'])) {
    return 'Insufficient USDC balance to buy a carton.'
  }

  if (message.includes('refund failed')) {
    return 'The purchase could not complete because the refund failed.'
  }

  return 'Could not buy the carton with USDC. Please try again.'
}

export function mapApproveUsdcError(error: unknown): string {
  const message = normalizeErrorMessage(error)
  const shared = mapSharedErrorMessage(message)
  if (shared) return shared

  if (includesAny(message, ['erc20insufficientbalance', 'transfer amount exceeds balance'])) {
    return 'Insufficient USDC balance to approve this amount.'
  }

  return 'Could not approve USDC. Please try again.'
}

export function mapPredictionErrorToMessage(error: unknown): string {
  const message = normalizeErrorMessage(error)
  const shared = mapSharedErrorMessage(message)
  if (shared) return shared

  if (message.includes("you aren't the owner of this carton")) {
    return 'The selected carton is not owned by the connected wallet.'
  }
  if (message.includes('prediction deadline passed')) {
    return 'Predictions are already closed for this tournament.'
  }
  if (message.includes('prediction already submitted')) {
    return 'Game predictions were already submitted for this carton.'
  }
  if (message.includes('must submit predictions for all games')) {
    return 'Complete all game predictions before submitting.'
  }
  if (includesAny(message, ['invalid game id', 'duplicate game id'])) {
    return 'The game list in the UI is out of sync. Refresh and try again.'
  }
  if (message.includes('cannot predict after results are set')) {
    return 'Some match results were already published, so this carton can no longer submit game predictions.'
  }

  return 'Could not submit game predictions. Please try again.'
}

export function mapWinnersErrorToMessage(error: unknown): string {
  const message = normalizeErrorMessage(error)
  const shared = mapSharedErrorMessage(message)
  if (shared) return shared

  if (message.includes("you aren't the owner of this carton")) {
    return 'The selected carton is not owned by the connected wallet.'
  }
  if (message.includes('prediction deadline passed')) {
    return 'Predictions are already closed for this tournament.'
  }
  if (message.includes('winners already predicted')) {
    return 'Winner predictions were already submitted for this carton.'
  }
  if (message.includes('duplicate team id')) {
    return 'Choose 4 different teams before submitting winners.'
  }
  if (message.includes('invalid team id')) {
    return 'One or more selected teams are invalid. Refresh and try again.'
  }

  return 'Could not submit winner predictions. Please try again.'
}

export function mapClaimError(error: unknown): string {
  const message = normalizeErrorMessage(error)
  const shared = mapSharedErrorMessage(message)
  if (shared) return shared

  if (message.includes('tournament not closed')) {
    return 'USDC prizes are not claimable yet.'
  }
  if (includesAny(message, ['not token owner', 'you aren\'t the owner of this carton'])) {
    return 'The connected wallet does not own this carton.'
  }
  if (message.includes('already claimed')) {
    return 'USDC prize was already claimed for this carton.'
  }
  if (message.includes('token not in leaderboard')) {
    return 'This carton is not ranked in the leaderboard.'
  }
  if (message.includes('invalid position')) {
    return 'Leaderboard positions are not configured correctly yet.'
  }
  if (message.includes('no prize available')) {
    return 'No USDC prize is available for this carton.'
  }

  return 'Could not claim the USDC prize. Please try again.'
}

export function mapAdminError(error: unknown): string {
  const message = normalizeErrorMessage(error)
  const shared = mapSharedErrorMessage(message)
  if (shared) return shared

  if (includesAny(message, ['ownableunauthorizedaccount', 'caller is not the owner'])) {
    return 'Connected wallet is not the contract owner.'
  }
  if (includesAny(message, ['accesscontrolunauthorizedaccount', 'missing role'])) {
    return 'Connected wallet does not have the required admin role.'
  }
  if (message.includes('teamshash frozen')) {
    return 'Teams hash is already frozen and can no longer be changed.'
  }
  if (message.includes('already frozen')) {
    return 'Teams hash is already frozen.'
  }
  if (message.includes('deadline must be in the future')) {
    return 'Submission deadline must be set to a future date.'
  }
  if (message.includes('predictions already started')) {
    return 'Predictions already started, so total games can no longer be changed.'
  }
  if (message.includes('totalgames must be > 0')) {
    return 'Total games must be greater than zero.'
  }
  if (message.includes('no predictions provided')) {
    return 'Enter at least one prediction entry before saving positions.'
  }
  if (message.includes('arrays must have same length')) {
    return 'Leaderboard token and point arrays must have the same length.'
  }
  if (message.includes('points must be ordered')) {
    return 'Leaderboard points must be sorted from highest to lowest.'
  }
  if (message.includes('results already set for this game')) {
    return 'This game already has an official result.'
  }
  if (message.includes('official winners already set')) {
    return 'Official winners were already set and cannot be changed.'
  }
  if (message.includes('official winners not set yet')) {
    return 'Official winners must be set before this action can succeed.'
  }
  if (message.includes('duplicate team id')) {
    return 'Select 4 different teams.'
  }
  if (message.includes('invalid team id')) {
    return 'One or more team IDs are invalid.'
  }
  if (message.includes('invalid game id')) {
    return 'The selected game ID is invalid.'
  }
  if (message.includes('tournament already closed')) {
    return 'This tournament is already closed for the selected asset.'
  }
  if (message.includes('no prize pool')) {
    return 'This tournament has no prize pool to close yet.'
  }
  if (message.includes('no prize distribution')) {
    return 'Prize distribution must be configured before closing the tournament.'
  }

  return 'Admin action failed. Review the inputs and try again.'
}
