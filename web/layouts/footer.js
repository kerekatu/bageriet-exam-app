import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Footer = () => {
  const router = useRouter()

  return (
    <FooterWrapper>
      <div className="footer-upper">
        <Link href={router.asPath}>
          <a className="scroll" title="Scroll To Top">
            <img src="/static/images/chevron.png" alt="Arrow Up" />
          </a>
        </Link>
        <h3>Bageriet</h3>
        <p>
          Der er mange tilgængelige udgave af Lorem Ipsum, men de fleste udgaver
          har gennemgået forandringer.
        </p>
      </div>
      <div className="footer-lower">
        Copyright &copy; {new Date().getFullYear()} – Bageriet Aps
      </div>
    </FooterWrapper>
  )
}

const FooterWrapper = styled.footer`
  display: grid;
  grid-template-rows: 1fr 6rem;

  .footer-upper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-gray-2);
    padding: 0 2rem;

    & > h3 {
      color: var(--color-white);
      font-family: var(--font-heading);
    }

    & > p {
      margin-top: 2.5rem;
      color: var(--color-gray-3);
      font-size: 1.4rem;
    }
  }

  .footer-lower {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-gray);
    color: var(--color-gray-3);
    font-size: 1.4rem;
  }

  .scroll {
    position: absolute;
    top: -2.5rem;
    background-color: #f0f0f0;
    border-radius: 50%;
    padding: 1rem;
    outline: 0;
    transition: background-color 0.15s ease-in-out;

    &:hover {
      background-color: var(--color-gray-4);
    }

    & img {
      transform: rotate(-90deg);
      display: block;
      height: 2.5rem;
    }
  }
`

export default Footer
