import styled from '@emotion/styled'
import CONSTANTS from '@/lib/constants'
import Link from 'next/link'

const Navbar = () => {
  return (
    <NavbarWrapper>
      <ul>
        {CONSTANTS.navbar.map((item, index) => {
          return (
            <li key={index}>
              <Link href={item.link}>
                <a className={item.label === 'bageriet' ? 'logo' : null}>
                  {item.label}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled.nav`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;

  ul {
    display: flex;
    gap: 0 2.5rem;
    list-style: none;
    justify-content: center;
    align-items: center;
  }

  a {
    text-decoration: none;
    color: var(--color-white);
    text-transform: uppercase;
    font-size: 1.4rem;
  }

  a.logo {
    font-family: var(--font-heading);
    font-size: var(--font-size-4);
    margin: 0 4.5rem;
    text-transform: none;
  }
`

export default Navbar
