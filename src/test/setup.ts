import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear()
})
