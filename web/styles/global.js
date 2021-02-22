import { css } from '@emotion/react'

export const mq = [37.5, 50, 62.5].map(
  (bp) => `@media only screen and (max-width: ${bp}em)`
)

const globalStyles = css`
  /* VARIABLES */

  :root {
  }

  /* BASE & RESET */

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }

  html {
    font-size: 62.5%;
    box-sizing: border-box;
  }

  body {
    font-size: 1.6rem;
  }

  #_next {
    min-height: 100vh;
  }
`

export default globalStyles
