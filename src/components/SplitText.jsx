import { Fragment } from 'react'

// Renders text as individually-animatable characters.
// Chars are grouped per word (nowrap) so lines only break at spaces.
export function Chars({ text }) {
  const words = text.split(' ')
  return (
    <span className="split-wrap" aria-label={text} role="text">
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="split-word" aria-hidden="true">
            {word.split('').map((c, i) => (
              <span className="split-mask" key={i}>
                <span className="split-char">{c}</span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}
