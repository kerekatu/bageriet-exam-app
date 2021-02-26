import Layout from '@/layouts/layout'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '@/lib/yup'
import styled from '@emotion/styled'
import Link from 'next/link'
import withAuth from '@/lib/withAuth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Title from '@/components/common/title'
import { mq } from '@/styles/global'

export const getServerSideProps = withAuth({})

const Login = ({ user }) => {
  const router = useRouter()
  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
  })

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [router, user])

  const onLoginSubmit = async (data) => {
    const response = await fetch('http://localhost:5033/login/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response) router.push('/')
  }

  return (
    <Layout isLoggedIn={user} pageTitle="Login">
      <LoginWrapper>
        <Title title="Login" />
        <form onSubmit={handleSubmit(onLoginSubmit)}>
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
              Login
            </button>
            <Link href="/register">
              <a>Opret bruger</a>
            </Link>
          </div>
        </form>
      </LoginWrapper>
    </Layout>
  )
}

const LoginWrapper = styled.section`
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

export default Login
