import ProductItem from '@/components/products/product-item'
import Layout from '@/layouts/layout'
import withAuth from '@/lib/withAuth'
import styled from '@emotion/styled'
import Link from 'next/link'

export const getServerSideProps = withAuth({
  callback: async (context) => {
    const response = await fetch(
      `http://localhost:5033/produkter/${context.params.id}`
    )
    const product = await response.json()

    return {
      product,
    }
  },
})

const Product = ({ user, data }) => {
  return (
    <Layout isLoggedIn={user} pageTitle={data.product?.titel}>
      <BreadcrumbsWrapper>
        <div>
          <p>
            <Link href="/produkter">
              <a>Produkter </a>
            </Link>
            &gt;
            <span className="active"> {data.product.titel}</span>
          </p>
        </div>
      </BreadcrumbsWrapper>
      <ProductItem productData={data} user={user} />
    </Layout>
  )
}

const BreadcrumbsWrapper = styled.div`
  display: block;
  background-color: var(--color-white);
  border: 0.1rem solid var(--color-gray-4);
  color: var(--color-gray-4);
  font-size: 1.4rem;
  padding: 1.5rem 2rem;
  margin: 0 2rem 4rem 2rem;

  a {
    text-decoration: none;
    color: var(--color-gray-4);
  }

  .active {
    color: var(--color-gray-3);
  }
`

export default Product
