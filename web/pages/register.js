import Layout from '@/layouts/layout'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { userSchema } from '@/lib/yup'
import styled from '@emotion/styled'
import Link from 'next/link'
import withAuth from '@/lib/withAuth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Title from '@/components/common/title'
import { mq } from '@/styles/global'

export const getServerSideProps = withAuth({})

const Register = ({ user }) => {
  const router = useRouter()
  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(userSchema),
  })

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [router, user])

  const onRegisterSubmit = async (data) => {
    const response = await fetch('http://localhost:5033/bruger', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response) router.push('/login')
  }

  return (
    <Layout isLoggedIn={user} pageTitle="Register">
      <RegisterWrapper>
        <Title title="Opret bruger" />
        <form onSubmit={handleSubmit(onRegisterSubmit)}>
          <input
            type="fornavn"
            name="fornavn"
            placeholder="*Fornavn"
            ref={register}
            className={errors?.fornavn && 'invalid'}
          />
          {errors?.fornavn && (
            <span role="alert">{errors.fornavn.message}</span>
          )}
          <input
            type="efternavn"
            name="efternavn"
            placeholder="*Efternavn"
            ref={register}
            className={errors?.efternavn && 'invalid'}
          />
          {errors?.efternavn && (
            <span role="alert">{errors.efternavn.message}</span>
          )}
          <input
            type="brugernavn"
            name="brugernavn"
            placeholder="*Brugernavn"
            ref={register}
            className={errors?.brugernavn && 'invalid'}
          />
          {errors?.brugernavn && (
            <span role="alert">{errors.brugernavn.message}</span>
          )}
          <input
            type="email"
            name="email"
            placeholder="*Email"
            ref={register}
            className={errors?.email && 'invalid'}
          />
          {errors?.email && <span role="alert">{errors.email.message}</span>}
          <input
            type="password"
            name="password"
            placeholder="*Password"
            ref={register}
            className={errors?.password && 'invalid'}
          />
          {errors?.password && (
            <span role="alert">{errors.password.message}</span>
          )}
          <div className="submit">
            <button type="submit" className="secondary">
              Opret Bruger
            </button>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </div>
        </form>
      </RegisterWrapper>
    </Layout>
  )
}

const RegisterWrapper = styled.section`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem 0;

    & span {
      color: red;
      width: 50%;
    }

    & input {
      background-color: var(--color-white);
      border: none;
      resize: vertical;
      padding: 2rem;
      width: 50%;

      ${mq[0]} {
        width: 100%;
      }

      &::placeholder {
        color: var(--color-blue);
        opacity: 0.8;
      }

      &:focus {
        outline: 0.1rem solid var(--color-blue);
      }
    }

    & input.invalid {
      outline: 0.1rem solid red;
    }

    .submit {
      display: flex;
      align-items: center;
      gap: 0 2rem;
      margin-top: 2rem;
    }

    .submit a {
      color: var(--color-gray);
      text-decoration: none;
      transition: opacity 0.15s ease-in-out;

      &:hover {
        opacity: 0.6;
      }
    }
  }
`

export default Register
