import { contactSchema } from '@/lib/yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import styled from '@emotion/styled'
import GoogleMapReact from 'google-map-react'
import { useState } from 'react'
import Modal from '../common/modal'
import { mq } from '@/styles/global'

const ContactForm = () => {
  const { register, errors, reset, handleSubmit } = useForm({
    resolver: yupResolver(contactSchema),
  })
  const [openModal, setOpenModal] = useState(false)

  const handleContactForm = async (data) => {
    const contact = await fetch('http://localhost:5033/kontakt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (contact) {
      setOpenModal(true)
      reset()
    }
  }

  return (
    <ContactFormWrapper>
      <form onSubmit={handleSubmit(handleContactForm)}>
        <input
          type="text"
          name="navn"
          placeholder="Dit navn..."
          ref={register}
        />
        <input
          type="email"
          name="email"
          placeholder="*Din email..."
          ref={register}
          className={errors?.email && 'invalid'}
        />
        {errors?.email && <span role="alert">{errors.email.message}</span>}
        <input
          type="text"
          name="emne"
          placeholder="*Dit emne..."
          ref={register}
          className={errors?.emne && 'invalid'}
        />
        {errors?.emne && <span role="alert">{errors.emne.message}</span>}
        <textarea
          name="besked"
          placeholder="*Din besked..."
          ref={register}
          className={errors?.besked && 'invalid'}
        />
        {errors?.besked && <span role="alert">{errors.besked.message}</span>}
        <button type="submit">Send</button>
      </form>
      <div className="map">
        <p>
          <strong>Adresse:</strong> Øster Uttrupvej 1 9200 Aalborg
        </p>
        <p>
          <strong>Telefon:</strong> +45 25 26 95 40
        </p>
        <GoogleMapReact
          defaultCenter={{
            lat: 57.047972805441646,
            lng: 9.966941214316783,
          }}
          defaultZoom={20}
        />
      </div>
      {openModal && (
        <Modal
          handleOpen={setOpenModal}
          render={() => <h3>Tak for din mail</h3>}
        />
      )}
    </ContactFormWrapper>
  )
}

const ContactFormWrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 12rem;
  gap: 0 4rem;

  ${mq[1]} {
    grid-template-columns: 1fr;
    gap: 8rem 0;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;
  }

  input,
  textarea {
    background-color: var(--color-white);
    border: none;
    resize: vertical;
    padding: 2rem;
    width: 100%;

    &::placeholder {
      color: var(--color-blue);
      opacity: 0.8;
    }

    &:focus {
      outline: 0.1rem solid var(--color-blue);
    }
  }

  textarea {
    min-height: 20rem;
  }

  .invalid {
    outline: 0.1rem solid red;
  }

  span[role='alert'] {
    color: red;
    font-size: 1.4rem;
  }

  button[type='submit'] {
    background-color: var(--color-blue);
    border: none;
    color: var(--color-white);
    padding: 1rem 3rem;
    font-size: var(--font-size-2);
    letter-spacing: 0.1rem;
    transition: opacity 0.15s ease-in-out;

    &:hover {
      opacity: 0.8;
    }
  }

  .map {
    color: var(--color-gray-3);

    & p:last-of-type {
      margin-bottom: 2rem;
    }

    & > div {
      height: 40rem !important;

      ${mq[1]} {
        height: 60rem !important;
      }
    }
  }
`

export default ContactForm
