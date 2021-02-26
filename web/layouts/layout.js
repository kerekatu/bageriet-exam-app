import Header from '@/layouts/header'
import Footer from '@/layouts/footer'
import styled from '@emotion/styled'
import Head from 'next/head'
import { mq } from '@/styles/global'

const Layout = ({
  isHeaderHero = false,
  isLoggedIn = false,
  pageTitle,
  children,
}) => {
  return (
    <LayoutWrapper isHeaderHero={isHeaderHero}>
      <Head>
        <title>{pageTitle || 'Not Found'} - Bageriet</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header isHeaderHero={isHeaderHero} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
      <Footer />
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-rows: ${({ isHeaderHero }) =>
      isHeaderHero ? '100vh' : '17rem'} 1fr 26rem;
  min-height: 100vh;

  ${mq[2]} {
    grid-template-rows: ${({ isHeaderHero }) =>
        isHeaderHero ? '100vh' : '25rem'} 1fr 26rem !important;
  }

  main {
    display: grid;
    grid-template-columns: 1fr min(100rem, 100%) 1fr;
    margin: 10rem 0 27rem 0;

    & > * {
      grid-column: 2;
    }
  }
`

export default Layout
