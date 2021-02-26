import Title from '@/components/common/title'
import Layout from '@/layouts/layout'
import withAuth from '@/lib/withAuth'
import styled from '@emotion/styled'
import React from 'react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { newsSchema } from '@/lib/yup'

export const getServerSideProps = withAuth({
  options: { isProtected: true, roles: ['ADMIN'] },
  callback: async (context) => {
    const response = await fetch(`http://localhost:5033/nyheder`)
    const news = await response.json()

    return {
      news,
    }
  },
})

const Admin = ({ user, data }) => {
  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(newsSchema),
  })
  const router = useRouter()

  const deleteNews = async (id) => {
    const response = await fetch(`http://localhost:5033/nyheder/admin/${id}`, {
      method: 'DELETE',
    })

    if (response) router.push(router.asPath)
  }

  const createNews = async (data) => {
    console.log(data)
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })

    const response = await fetch('http://localhost:5033/nyheder/admin', {
      method: 'POST',
      body: formData,
    })

    if (response) router.push(router.asPath)
  }

  return (
    <Layout isLoggedIn={user} pageTitle="Admin">
      <AdminWrapper>
        <Title title="Admin panel" />
        <form className="create" onSubmit={handleSubmit(createNews)}>
          <input
            type="text"
            name="titel"
            placeholder="*Titel"
            ref={register}
            className={errors?.titel && 'invalid'}
          />
          {errors?.titel && <span role="alert">{errors.titel.message}</span>}
          <input
            type="text"
            name="teaser"
            placeholder="*Teaser"
            ref={register}
            className={errors?.teaser && 'invalid'}
          />
          {errors?.teaser && <span role="alert">{errors.teaser.message}</span>}
          <textarea
            type="text"
            name="nyhedstekst"
            placeholder="*Nyhedstekst"
            ref={register}
            className={errors?.nyhedstekst && 'invalid'}
          />
          {errors?.nyhedstekst && (
            <span role="alert">{errors.nyhedstekst.message}</span>
          )}
          <input
            type="file"
            name="image"
            ref={register}
            className={errors?.nyhedstekst && 'invalid'}
          />
          {errors?.image && <span role="alert">{errors.image.message}</span>}
          <button type="submit" className="secondary">
            Indsæt
          </button>
        </form>
        <h4>Alle Nyheder</h4>
        <ul>
          {data.news.map((item) => (
            <li key={item._id}>
              <h4>{item.titel}</h4>
              <div className="controls">
                <button type="button" title="Ret nyhed">
                  <Icon icon={faPen} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteNews(item._id)}
                  title="Slet nyhed"
                >
                  <Icon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </AdminWrapper>
    </Layout>
  )
}

const AdminWrapper = styled.section`
  ul {
    display: flex;
    flex-direction: column;
    gap: 2rem 0;
    margin-top: 2rem;
  }

  h4 {
    color: var(--color-blue);
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-white);
    padding: 2rem;
    color: var(--color-gray-2);
  }

  .create {
    display: flex;
    flex-direction: column;
    gap: 2rem 0;
    padding: 2rem;
    background-color: var(--color-white);
    color: var(--color-gray-2);
    margin-bottom: 6rem;

    & input,
    & textarea {
      border: 0.1rem solid var(--color-gray-4);
      border-radius: 0.6rem;
      padding: 1rem;
      resize: vertical;
    }

    .invalid {
      border: 0.1rem solid red;
    }
  }

  .controls {
    display: flex;
    gap: 0 2rem;

    & button {
      background-color: transparent;
      border: none;
      color: var(--color-blue);
      transition: opacity 0.15s ease-in-out;

      &:hover {
        opacity: 0.6;
      }
    }
  }
`

export default Admin
