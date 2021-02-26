import { css } from '@emotion/react'
import fontStyles from '@/styles/fonts'

export const mq = [37.5, 50, 62.5].map(
  (bp) => `@media only screen and (max-width: ${bp}em)`
)

const globalStyles = css`
  /* IMPORTS */

  ${fontStyles}

  /* VARIABLES */

  :root {
    --color-white: #fff;
    --color-black: #000;
    --color-gray: #252525;
    --color-gray-2: #333;
    --color-gray-3: #777;
    --color-gray-4: #c0c0c0;
    --color-gray-5: #fafafa;
    --color-blue: #607684;
    --color-blue-2: #45525a;
    --color-blue-3: #324049;

    --font-body: 'Open sans', sans-serif;
    --font-heading: 'Lobster', sans-serif;
    --font-weight-1: 200;
    --font-weight-2: 400;
    --font-weight-3: 600;
    --font-size-1: 1.6rem;
    --font-size-2: 1.8rem;
    --font-size-3: 3.6rem;
    --font-size-4: 6.4rem;
    --font-size-5: 8.4rem;
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

    ${mq[2]} {
      font-size: 50%;
    }
  }

  body {
    font-size: var(--font-size-1);
    font-family: 'Open Sans';
    font-weight: var(---font-weight-2);
    line-height: 1.58;
    background-color: var(--color-gray-5);
  }

  #__next {
    min-height: 100vh;
  }

  ul,
  ol {
    list-style: none;
  }

  input,
  button,
  textarea {
    font-size: 1.4rem;
    font-family: var(----font-body);
    line-height: 1;
  }

  button {
    display: block;
    cursor: pointer;
  }

  /* CUSTOM */

  h1 {
    font-size: var(--font-size-5);
    font-family: var(--font-heading);
  }

  h2 {
    font-size: var(--font-size-4);
  }

  h3 {
    font-size: var(--font-size-3);
  }

  h4 {
    font-size: var(--font-size-2);
  }

  button.primary {
    background-color: transparent;
    border: 0.1rem solid var(--color-blue);
    color: var(--color-blue);
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    font-size: var(--font-size-1);
    padding: 1rem;
    transition: all 0.15s ease-in-out;
  }

  button.primary:hover {
    color: var(--color-white);
    background-color: var(--color-blue);
  }

  button.secondary {
    background-color: var(--color-blue);
    border: none;
    color: var(--color-white);
    padding: 1.2rem 6rem;
    font-size: var(--font-size-2);
    letter-spacing: 0.1rem;
    transition: background-color 0.15s ease-in-out;
  }

  button.secondary:hover {
    background-color: var(--color-blue-2);
  }

  section,
  article {
    padding: 0 2rem;
  }

  .full-bleed {
    width: 100%;
    grid-column: 1 / -1 !important;
  }
`

export default globalStyles
