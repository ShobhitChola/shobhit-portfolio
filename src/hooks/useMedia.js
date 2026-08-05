export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hoverCapable = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const isMobileView = () => window.matchMedia('(max-width: 820px)').matches

export const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
