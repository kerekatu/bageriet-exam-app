import Title from '@/components/common/title'
import Layout from '@/layouts/layout'
import withAuth from '@/lib/withAuth'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'

export const getServerSideProps = withAuth({
  options: { isProtected: true, roles: ['Medlem'] },
})

const Profil = ({ user }) => {
  const router = useRouter()

  const handleLogout = async () => {
    const response = await fetch('http://localhost:5033/login/logout', {
      credentials: 'include',
    })

    if (response) router.push('/')
  }

  return (
    <Layout isLoggedIn={user} pageTitle="Profil">
      <ProfilWrapper>
        <Title title="Profil" />
        <img src="/static/images/profil.jpg" alt="Profile Picture" />
        <h4>Brugeroplysninger</h4>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Brugernavn:</strong> {user.brugernavn}
        </p>
        <p>
          <strong>Navn:</strong> {user.fornavn} {user.efternavn}
        </p>
        <button className="secondary" onClick={handleLogout}>
          Log ud
        </button>
      </ProfilWrapper>
    </Layout>
  )
}

const ProfilWrapper = styled.section`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;

  h4 {
    margin-bottom: 1rem;
  }

  button {
    margin-top: 2rem;
  }

  img {
    margin-bottom: 2rem;
    border-radius: 50%;
    display: block;
    width: 15rem;
  }
`

export default Profil
