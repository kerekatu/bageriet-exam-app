import Title from '@/components/common/title'
import ContactForm from '@/components/contact'
import Layout from '@/layouts/layout'
import withAuth from '@/lib/withAuth'

export const getServerSideProps = withAuth({})

const Contact = ({ user }) => {
  return (
    <Layout isLoggedIn={user} pageTitle="Kontakt">
      <Title
        title="Kontakt Os"
        subtitle="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum cupiditate optio rerum non, quasi laudantium dolores doloribus repellat aut adipisci expedita."
      />
      <ContactForm />
    </Layout>
  )
}

export default Contact
