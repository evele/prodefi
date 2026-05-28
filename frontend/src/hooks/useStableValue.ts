import { useEffect, useState } from 'react'

export function useStableValue<T>(value: T | undefined, isValid: boolean) {
  const [stableValue, setStableValue] = useState<T | undefined>(value)

  useEffect(() => {
    if (isValid && value !== undefined) {
      setStableValue(value)
    }
  }, [isValid, value])

  return isValid ? value : stableValue
}
