import Header from '@/layouts/header'
import Footer from '@/layouts/footer'
import styled from '@emotion/styled'

const Layout = ({ isHeaderHero = false, children }) => {
  return (
    <LayoutWrapper isHeaderHero={isHeaderHero}>
      <Header isHeaderHero={isHeaderHero} />
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
