import { mq } from '@/styles/global'
import styled from '@emotion/styled'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export const Portal = ({ children }) => {
  let modalRoot = document.getElementById('modal')

  if (!modalRoot) {
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modal')
    document.body.appendChild(modalRoot)
  }

  const modalElement = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(modalElement)
    return () => modalRoot.removeChild(modalElement)
  })

  return createPortal(children, modalElement)
}

const Modal = ({ children, render, handleOpen }) => {
  return (
    <Portal>
      <ModalWrapper>
        <div className="modal">
          {render(children) || children}
          <button onClick={() => handleOpen(false)}>Luk</button>
        </div>
      </ModalWrapper>
    </Portal>
  )
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;

  .modal {
    display: flex;
    flex-direction: column;
    background-color: var(--color-white);
    padding: 6rem;
    border-radius: 0.6rem;
    width: 70rem;
    text-align: center;
    color: var(--color-gray-2);

    ${mq[1]} {
      width: 100%;
      margin: 0 2rem;
    }
  }

  button {
    margin-top: 4rem;
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
`

export default Modal
