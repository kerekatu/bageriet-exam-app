import Title from '@/components/common/title'
import ProductList from '@/components/products/product-list'
import Layout from '@/layouts/layout'

const Products = () => {
  return (
    <Layout>
      <Title
        title="Vores elskede bagværk"
        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo rem saepe eius nisi aliquid, quia magnam numquam deleniti dolores nostrum neque maiores labore."
      />
      <ProductList includeCategories />
    </Layout>
  )
}

export default Products
