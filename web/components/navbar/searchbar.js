import { useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { mq } from '@/styles/global'

const Searchbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  return (
    <SearchbarWrapper>
      <button type="button" onClick={() => setIsOpen(!isOpen)}>
        <Icon icon={faSearch} />
      </button>

      {isOpen && (
        <div className="searchbar">
          <input
            type="text"
            placeholder="Søg efter produkter..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          />
          <button onClick={() => router.push(`/search/${search}`)}>Søg</button>
        </div>
      )}
    </SearchbarWrapper>
  )
}

const SearchbarWrapper = styled.div`
  position: relative;

  & button {
    background-color: transparent;
    border: none;
    color: var(--color-white);
    font-size: var(--font-size-1);
  }

  .searchbar {
    display: flex;
    bottom: -5rem;
    left: -12rem;
    position: absolute;

    ${mq[0]} {
      left: -28rem;
    }

    & input {
      border: none;
      font-size: var(--font-size-1);
      padding: 0.5rem 1rem;
    }

    & button {
      background-color: var(--color-blue);
      padding: 0.5rem 1rem;
      transition: background-color 0.15s ease-in-out;

      &:hover {
        background-color: var(--color-blue-2);
      }
    }
  }
`

export default Searchbar
