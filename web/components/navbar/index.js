import styled from '@emotion/styled'
import CONSTANTS from '@/lib/constants'
import Link from 'next/link'
import Searchbar from '@/components/navbar/searchbar'
import { mq } from '@/styles/global'
import { useRouter } from 'next/router'

const Navbar = ({ isLoggedIn }) => {
  const router = useRouter()

  return (
    <NavbarWrapper>
      <ul>
        {CONSTANTS.navbar.map((item, index) => {
          if (isLoggedIn && item.label === 'Login') {
            return
          } else if (!isLoggedIn && item.label === 'Profil') {
            return
          }

          return (
            <li
              key={index}
              className={item.label === 'bageriet' ? 'logo' : null}
            >
              <Link href={item.link}>
                <a className={item.link === router.asPath ? 'active' : null}>
                  {item.label}
                </a>
              </Link>
            </li>
          )
        })}
        <li>
          <Searchbar />
        </li>
      </ul>
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled.nav`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;

  ${mq[2]} {
    height: 25rem;
  }

  ul {
    display: flex;
    gap: 0 2.5rem;
    list-style: none;
    justify-content: center;
    align-items: center;

    ${mq[2]} {
      display: grid;
      grid-template-rows: repeat(2, 1fr);
      grid-template-columns: repeat(5, max-content);
      text-align: center;
    }
  }

  ${mq[2]} {
    li {
      grid-row: 2 / -1;
    }

    li.logo {
      grid-row: 1 / 2;
      grid-column: 1 / -1;
    }
  }

  a {
    text-decoration: none;
    color: var(--color-white);
    text-transform: uppercase;
    font-size: 1.4rem;
    transition: opacity 0.15s ease-in-out;

    &:hover {
      opacity: 0.6;
    }
  }

  a.active {
    font-weight: var(--font-weight-3);

    &:hover {
      opacity: 1;
    }
  }

  li.logo > a {
    font-family: var(--font-heading);
    font-size: var(--font-size-4);
    margin: 0 4.5rem;
    text-transform: none;
    font-weight: var(--font-weight-1) !important;
  }
`

export default Navbar
