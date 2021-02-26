import Title from '@/components/common/title'
import Layout from '@/layouts/layout'
import withAuth from '@/lib/withAuth'
import styled from '@emotion/styled'
import Link from 'next/link'

export const getServerSideProps = withAuth({
  callback: async (context) => {
    const response = await fetch(
      `http://localhost:5033/produkter/soeg/${context.params.name}`
    )
    const searchResults = await response.json()

    return {
      searchResults,
    }
  },
})

const Search = ({ user, data }) => {
  return (
    <Layout isLoggedIn={user} pageTitle="Søgeresultater">
      <Title title={`Søgeresultater (${data?.searchResults.length})`} />
      <SearchWrapper>
        {data?.searchResults.map((result) => (
          <li key={result._id}>
            <Link href={`/produkter/${result._id}`}>
              <a>{result.titel}</a>
            </Link>
          </li>
        ))}
      </SearchWrapper>
    </Layout>
  )
}

const SearchWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem 0;
  align-items: center;

  a {
    color: var(--color-gray-2);
    text-decoration: none;
    font-weight: var(--font-weight-3);
    transition: opacity 0.15s ease-in-out;

    &:hover {
      opacity: 0.6;
    }
  }
`

export default Search
