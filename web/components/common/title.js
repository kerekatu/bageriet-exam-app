import styled from '@emotion/styled'

const Title = ({ title, subtitle }) => {
  return (
    <TitleWrapper>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </TitleWrapper>
  )
}

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & h3 {
    color: var(--color-blue-3);
    font-family: var(--font-heading);
    margin-bottom: 4rem;
  }

  & p {
    color: var(--color-gray-3);
    width: 80%;
    text-align: center;
  }
`

export default Title
