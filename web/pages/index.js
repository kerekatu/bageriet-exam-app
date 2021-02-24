import Title from '@/components/common/title'
import Intro from '@/components/home/intro'
import Newsletter from '@/components/home/newsletter'
import ProductList from '@/components/products/product-list'
import Layout from '@/layouts/layout'

export default function Home() {
  return (
    <Layout isHeaderHero>
      <Intro />
      <Newsletter />
      <Title
        title="Nyeste bagværk"
        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab nobis quae, necessitatibus et sint animi eveniet eligendi omnis molestiae culpa modi vero molestias ducimus deleniti eius a, voluptatibus debitis laborum."
      />
      <ProductList amount="8" />
    </Layout>
  )
}
