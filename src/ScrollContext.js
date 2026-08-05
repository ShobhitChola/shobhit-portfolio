import { createContext, useContext } from 'react'

// scrollTo(target) — target is a selector string or a number.
export const ScrollContext = createContext(() => {})
export const useScrollTo = () => useContext(ScrollContext)
