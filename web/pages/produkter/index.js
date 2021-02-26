import Title from '@/components/common/title'
import ProductList from '@/components/products/product-list'
import Layout from '@/layouts/layout'
import withAuth from '@/lib/withAuth'

export const getServerSideProps = withAuth({})

const Products = ({ user }) => {
  return (
    <Layout isLoggedIn={user} pageTitle="Produkter">
      <Title
        title="Vores elskede bagværk"
        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo rem saepe eius nisi aliquid, quia magnam numquam deleniti dolores nostrum neque maiores labore."
      />
      <ProductList includeCategories />
    </Layout>
  )
}

export default Products
