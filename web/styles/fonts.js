import { css } from '@emotion/react'

const fontStyles = css`
  @font-face {
    font-family: 'Lobster';
    src: url('/static/fonts/lobster_1.4-webfont.woff2') format('woff2'),
      url('/static/fonts/lobster_1.4-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('/static/fonts/opensans-semibold-webfont.woff2') format('woff2'),
      url('/static/fonts/opensans-semibold-webfont.woff') format('woff');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('/static/fonts/opensans-regular-webfont.woff2') format('woff2'),
      url('/static/fonts/opensans-regular-webfont.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('/static/fonts/opensans-light-webfont.woff2') format('woff2'),
      url('/static/fonts/opensans-light-webfont.woff') format('woff');
    font-weight: 200;
    font-style: normal;
  }
`

export default fontStyles
