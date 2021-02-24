import CONSTANTS from '@/lib/constants'
import styled from '@emotion/styled'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

const ProductList = ({ amount, includeCategories }) => {
  const [currentCategory, setCurrentCategory] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState(null)
  const { data: products } = useSWR(
    `http://localhost:5033/produkter/${amount ? 'antal/' + amount : ''}`,
    fetcher
  )
  const { data: categories } = useSWR(
    includeCategories && `http://localhost:5033/kategorier`,
    fetcher
  )

  useEffect(() => {
    if (!categories) return

    setCurrentCategory(categories[0])
  }, [categories])

  useEffect(() => {
    if (!products) return
    setSelectedProducts(() =>
      includeCategories
        ? products.filter(
            (product) => product.kategori.titel === categories[0].titel
          )
        : products
    )
  }, [categories, products, includeCategories])

  const changeCategory = (category) => {
    setCurrentCategory(category)
    setSelectedProducts(
      products.filter((product) => product.kategori.titel === category.titel)
    )
  }

  return (
    <ProductListWrapper includeCategories={includeCategories}>
      {includeCategories && (
        <nav className="categories">
          <ul>
            {categories?.map((category) => (
              <li key={category._id}>
                <button
                  type="button"
                  className={
                    currentCategory?.titel === category.titel ? 'active' : null
                  }
                  onClick={() => changeCategory(category)}
                >
                  {category.titel}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ul className="products">
        {selectedProducts?.map((product) => (
          <li key={product._id}>
            <img
              src={`${CONSTANTS.productImagesPath}/${product.image}`}
              alt={product.title}
            />
            <div className="comments">
              <span>{product?.kommentar.length}</span>
              <Icon icon={faComments} />
            </div>
            <h4>{product?.titel}</h4>
            <p>
              {product?.teaser.length > 80
                ? `${product.teaser.substring(0, 80).trim()}...`
                : product.teaser}
            </p>
            <Link href={`/produkter/${product._id}`}>
              <button className="primary" type="button">
                Se Mere
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </ProductListWrapper>
  )
}

const ProductListWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ includeCategories }) =>
    includeCategories ? 'min-content 3fr' : ''};
  gap: 8rem;
  margin-top: 8rem;

  .products {
    display: grid;
    gap: 6rem 4rem;
    ${({ includeCategories }) =>
      includeCategories
        ? 'grid-template-columns: repeat(3, 1fr)'
        : 'grid-template-columns: repeat(4, 1fr)'};

    & li {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2rem 0;
      color: var(--color-gray-3);
    }

    & img {
      width: 100%;
      height: 18rem;
      display: block;
      object-fit: cover;
      pointer-events: none;
    }

    & h4 {
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      color: var(--color-gray);
    }

    & button {
      width: 80%;
    }
  }

  .comments {
    display: flex;
    align-items: center;
    gap: 0 0.6rem;
    color: var(--color-gray-4);
  }

  .categories {
    & ul {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2rem 0;
    }

    & button {
      background-color: transparent;
      border: none;
      font-size: var(--font-size-2);
      color: var(--color-gray-4);
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      transition: color 0.15s ease-in-out;

      &:hover {
        color: var(--color-gray);
      }
    }

    & button.active {
      color: var(--color-gray);
    }
  }
`

export default ProductList
