import styled from '@emotion/styled'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

const Newsletter = () => {
  return (
    <NewsletterWrapper className="full-bleed">
      <div className="container">
        <h3>Tilmeld dig vores nyhedsbrev</h3>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
        <form className="form">
          <div className="form-icon">
            <Icon icon={faEnvelope} />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="indtast din email..."
          />
          <button>Tilmeld</button>
        </form>
      </div>
    </NewsletterWrapper>
  )
}

const NewsletterWrapper = styled.section`
  color: var(--color-white);
  background: url('/static/images/newsletterbg.jpg') no-repeat center;
  background-size: cover;
  margin-bottom: 10rem;

  .container {
    width: 100rem;
    margin: 0 auto;
    padding: 10rem 0 20rem 0;

    & h3 {
      font-family: var(--font-heading);
    }

    & p {
      margin-bottom: 5rem;
      font-size: 1.4rem;
    }
  }

  .form {
    display: flex;

    & input,
    & button {
      height: 4.5rem;
    }

    & input {
      width: 100%;
      padding: 0 1rem;
      border: none;

      &::placeholder {
        color: var(--color-blue);
        opacity: 0.8;
      }
    }

    & button {
      padding: 0.4rem 4rem;
      border: none;
      background-color: var(--color-blue);
      color: var(--color-white);
      text-transform: uppercase;
      letter-spacing: 0.2rem;
    }
  }

  .form-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-gray-3);
    height: 4.5rem;
    width: 6rem;
  }
`

export default Newsletter
