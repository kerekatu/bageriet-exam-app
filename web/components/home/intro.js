import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Title from '../common/title'

const Intro = () => {
  const [sortedArticles, setSortedArticles] = useState(null)
  const { data: articles, error } = useSWR(
    'http://localhost:5033/nyheder',
    (url) => fetch(url).then((r) => r.json())
  )

  useEffect(() => {
    if (!articles || error) return

    setSortedArticles(() =>
      articles
        .sort((a, b) => {
          const dateA = new Date(a.oprettet)
          const dateB = new Date(b.oprettet)
          return dateB - dateA
        })
        .slice(0, 3)
    )
  }, [articles, error])

  return (
    <IntroWrapper>
      <Title
        title="Vi skaber lækkert brød!"
        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab nobis quae, necessitatibus et sint animi eveniet eligendi omnis molestiae culpa modi vero molestias ducimus deleniti eius a, voluptatibus debitis laborum."
      />
      <div className="features">
        {sortedArticles?.map((article) => (
          <div key={article._id}>
            <img src={`/static/images/${article.image}`} alt={article.titel} />
            <h4>{article.titel}</h4>
            <p>{article.teaser}</p>
          </div>
        ))}
      </div>
    </IntroWrapper>
  )
}

const IntroWrapper = styled.section`
  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0 7rem;
    margin: 10rem 0 20rem 0;

    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    & h4 {
      margin: 4rem 0 2rem 0;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      color: var(--color-blue-3);
    }

    & img {
      display: block;
      border-radius: 50%;
      width: 20rem;
      height: 20rem;
    }

    & p {
      color: var(--color-gray-3);
      font-size: 1.4rem;
    }
  }
`

export default Intro
