import CONSTANTS from '@/lib/constants'
import { commentSchema } from '@/lib/yup'
import { mq } from '@/styles/global'
import styled from '@emotion/styled'
import {
  faHeart,
  faComments,
  faPencilAlt,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import da from 'date-fns/locale/da'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const ProductItem = ({ productData, user }) => {
  const [likes, setLikes] = useState(productData.product.likes)
  const [currentPage, setCurrentPage] = useState(1)
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(commentSchema),
  })
  const router = useRouter()

  const likeProduct = async () => {
    const like = await fetch(
      `http://localhost:5033/produkter/likes/${productData.product._id}`,
      { method: 'PATCH', body: JSON.stringify(productData.product.likes + 1) }
    )

    if (like) setLikes(likes + 1)
  }

  const paginateComments = (data) => {
    const PER_PAGE = 3
    const offset = (currentPage - 1) * PER_PAGE
    const currentPageData = data.slice(offset, offset + PER_PAGE)

    return currentPageData
  }

  const postComment = async (data) => {
    if (!user) return

    const comment = await fetch(`http://localhost:5033/kommentar/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kommentaren: data.kommentaren,
        bruger: user._id,
        produkt: productData.product?._id,
      }),
    })

    if (comment) {
      router.push(router.asPath)
    }
  }

  const deleteComment = async (id) => {
    const comment = await fetch(`http://localhost:5033/kommentar/admin/${id}`, {
      method: 'DELETE',
    })

    if (comment) {
      router.push(router.asPath)
    }
  }

  return (
    <ProductItemWrapper>
      <div className="upper">
        <div className="title">
          <h3>{productData.product?.titel}</h3>
          <h4>{productData.product?.kategori.titel}</h4>
        </div>
        <button
          className={
            productData.product?.likes !== likes ? 'primary active' : 'primary'
          }
          onClick={() => productData.product?.likes === likes && likeProduct()}
        >
          <span>LIKE! ({likes})</span> <Icon icon={faHeart} />
        </button>
      </div>
      <div className="product">
        <div className="info">
          <img
            src={`${CONSTANTS.productImagesPath}/${productData.product?.image}`}
            alt={productData.product?.titel}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: productData.product?.beskrivelse,
            }}
          ></div>
        </div>
        <div className="ingredients">
          <h4>Ingredienser</h4>
          <ul>
            {productData.product?.ingredienser.map((item) => (
              <li key={item._id}>
                {item?.maengde}
                {item?.enhed_forkortet}. {item?.ingrediens_titel}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="comments">
        <div className="comments-title">
          <h4>Kommentar</h4>
          <p>
            <span>{productData.product?.kommentar.length}</span>
            <Icon icon={faComments} />
          </p>
        </div>
        <form onSubmit={handleSubmit(postComment)}>
          <div>
            <i>
              <Icon icon={faPencilAlt} />
            </i>
            <input
              type="text"
              name="kommentaren"
              placeholder="Fortæl os hvad du synes..."
              ref={register}
            />
          </div>

          <button
            type="submit"
            title="Post Comment"
            onClick={() => !user && router.push('/login')}
          >
            Indsæt
          </button>
        </form>
        <div>
          <ul>
            {paginateComments(productData.product.kommentar).map((comment) => (
              <li key={comment._id} className="comment">
                <img src="/static/images/profil.jpg" alt="Profile Image" />
                <div>
                  <h4>
                    {comment.bruger.fornavn} {comment.bruger.efternavn}
                  </h4>
                  <span>
                    {format(new Date(comment.oprettet), 'dd MMMM yyyy, HH:mm', {
                      locale: da,
                    })}
                  </span>
                  <p>{comment.kommentaren}</p>
                  {user && comment.bruger?._id === user._id && (
                    <button
                      className="primary"
                      onClick={() => deleteComment(comment._id)}
                    >
                      Slet
                    </button>
                  )}
                </div>
              </li>
            ))}
            <div className="pagination">
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
              >
                <Icon icon={faChevronLeft} />
              </button>
              <p>{currentPage}</p>
              <button
                onClick={() =>
                  productData.product.kommentar.length / 3 >= currentPage &&
                  setCurrentPage(currentPage + 1)
                }
              >
                <Icon icon={faChevronRight} />
              </button>
            </div>
          </ul>
        </div>
      </div>
    </ProductItemWrapper>
  )
}

const ProductItemWrapper = styled.article`
  display: flex;
  flex-direction: column;

  .upper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0 2rem;

    ${mq[0]} {
      flex-direction: column;
    }

    & h3,
    & h4 {
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      line-height: 1.2;
    }

    & h3 {
      color: var(--color-gray);
    }

    & h4 {
      color: var(--color-gray-3);
    }

    & button {
      font-size: 1.4rem;
      padding: 1.5rem 0;
      width: 25rem;
      word-break: none;

      ${mq[0]} {
        width: 100%;
        margin-top: 4rem;
      }
    }
  }

  .product {
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin: 6rem 0 10rem 0;
    gap: 0 4rem;

    ${mq[0]} {
      grid-template-columns: 1fr;
      gap: 4rem;
    }

    & .info > img {
      display: block;
      width: 25rem;
      height: 25rem;
      object-fit: cover;
      float: left;
      margin: 0 2rem 0 0;

      ${mq[0]} {
        width: 100%;
        float: none;
        margin-bottom: 2rem;
      }
    }

    & .ingredients > h4 {
      color: var(--color-gray-2);
      margin-bottom: 2rem;
    }

    & .ingredients > ul {
      display: flex;
      flex-direction: column;
      gap: 1rem 0;
    }

    & .ingredients li {
      text-align: center;
      padding: 2rem 0;
      background-color: var(--color-white);
      border: 0.1rem solid var(--color-gray-4);
      color: var(--color-gray-3);
    }
  }

  .comments {
    display: flex;
    flex-direction: column;
    gap: 2rem 0;

    & .comments-title {
      background-color: var(--color-white);
      border: 0.1rem solid var(--color-gray-4);
      padding: 2rem 3rem;
      display: flex;
      justify-content: space-between;
      color: var(--color-gray-4);
    }

    & .comments-title > h4 {
      color: var(--color-gray-2);
    }

    & .comments-title > p {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    & form {
      display: flex;
      position: relative;
    }

    & form > div {
      width: 100%;
    }

    & form input {
      background-color: var(--color-white);
      border: 0.1rem solid var(--color-gray-4);
      padding: 2rem 6rem;
      width: inherit;
    }

    & form i {
      position: absolute;
      left: 3rem;
      color: var(--color-gray-2);
      top: 25%;
    }

    & form button {
      background-color: var(--color-blue);
      border: none;
      color: var(--color-white);
      padding: 0 6rem;
      font-size: var(--font-size-2);
      letter-spacing: 0.1rem;
      margin-left: 0.5rem;
      transition: background-color 0.15s ease-in-out;

      &:hover {
        background-color: var(--color-blue-2);
      }
    }

    & ul {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .comment {
      display: grid;
      gap: 0 4rem;
      align-items: center;
      grid-template-columns: min-content 1fr;
      background-color: var(--color-white);
      border: 0.1rem solid var(--color-gray-4);
      padding: 2rem 3rem;
    }

    .comment img {
      align-self: flex-start;
      display: block;
      border-radius: 50%;
      width: 10rem;
      height: 10rem;
      object-fit: cover;
    }

    .comment h4 {
      color: var(--color-gray-2);
      line-height: 1.2;
    }

    .comment span {
      display: block;
      font-size: 1.4rem;
      color: var(--color-gray-3);
      margin-bottom: 2rem;
    }

    .comment p {
      color: var(--color-gray-2);
      font-weight: var(--font-weight-1);
    }

    .comment button {
      margin-top: 2rem;
      font-size: 1.4rem;
      padding: 1.2rem 3rem;
    }

    .pagination {
      display: flex;
      gap: 0 1rem;
    }

    .pagination > * {
      background-color: var(--color-white);
      border: 0.1rem solid var(--color-gray-4);
      padding: 0.5rem 2rem;
      color: var(--color-gray-3);
    }
  }

  .primary.active {
    color: var(--color-white);
    background-color: var(--color-blue);
  }
`

export default ProductItem
