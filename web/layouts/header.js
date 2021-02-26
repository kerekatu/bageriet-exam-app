import Navbar from '@/components/navbar'
import useSlider from '@/hooks/useSlider'
import CONSTANTS from '@/lib/constants'
import { mq } from '@/styles/global'
import styled from '@emotion/styled'

const Header = ({ isHeaderHero, isLoggedIn }) => {
  const { currentSlide, handleSlide } = useSlider(CONSTANTS.slider.length, 6000)

  if (!isHeaderHero) {
    return (
      <HeaderWrapper>
        <Navbar isLoggedIn={isLoggedIn} />
      </HeaderWrapper>
    )
  }

  return (
    <HeaderWrapper isHeaderHero={isHeaderHero} currentSlide={currentSlide}>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="slider">
        <h1>{CONSTANTS.slider[currentSlide]?.label}</h1>
        <div className="slider-arrows">
          <button
            onClick={() => handleSlide(currentSlide - 1)}
            title="Previous Slide"
          >
            <img src="/static/images/chevron.png" alt="Left Arrow" />
          </button>
          <button
            onClick={() => handleSlide(currentSlide + 1)}
            title="Next Slide"
          >
            <img src="/static/images/chevron.png" alt="Right Arrow" />
          </button>
        </div>
        <div className="slider-pagination">
          {CONSTANTS.slider.map((item, index) => (
            <button
              className={currentSlide === index ? 'active' : null}
              onClick={() => handleSlide(index)}
              key={index}
            />
          ))}
        </div>
      </div>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  height: inherit;
  background: url(${CONSTANTS.sliderImagesPath}/${CONSTANTS.slider[0].image})
    no-repeat top;

  ${mq[2]} {
    grid-template-rows: 25rem 1fr !important;
  }

  ${({ isHeaderHero, currentSlide }) =>
    isHeaderHero && {
      display: 'grid',
      gridTemplateRows: '17rem 1fr',
      background: `url(${CONSTANTS.sliderImagesPath}/${CONSTANTS.slider[currentSlide].image}) no-repeat top`,
      backgroundSize: 'cover',
    }}

  .slider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 17rem;

    & > h1 {
      color: var(--color-white);
      text-align: center;
      padding: 0 10rem;

      ${mq[0]} {
        font-size: var(--font-size-4);
        padding: 0 4rem;
      }
    }
  }

  .slider-arrows {
    display: relative;

    ${mq[0]} {
      display: none;
    }

    & > button {
      background-color: transparent;
      border: none;
      opacity: 0.4;
      cursor: pointer;
      position: absolute;
      transition: opacity 0.15s ease-in-out;
    }

    & > button:hover {
      opacity: 0.2;
    }

    & img {
      height: 4.5rem;
      width: 5rem;
      filter: invert(100%);
    }

    & > button:first-of-type {
      top: 50%;
      left: 4rem;
    }

    & > button:last-of-type {
      top: 50%;
      right: 4rem;
    }

    & > button:first-of-type > img {
      transform: rotate(180deg);
    }
  }

  .slider-pagination {
    position: absolute;
    display: flex;
    gap: 0 1rem;
    bottom: 7rem;

    & > button {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
    }

    & > button:hover {
      background-color: var(--color-gray-3);
    }

    & > button.active {
      background-color: var(--color-gray-3);
    }
  }
`

export default Header
