import { useEffect, useState } from 'react'

const useSlider = (sliderLength, interval = 3000) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleSlide = (value) => {
    if (sliderLength - 1 < value) {
      setCurrentSlide(0)
    } else if (value < 0) {
      setCurrentSlide(sliderLength - 1)
    } else {
      setCurrentSlide(value)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < sliderLength - 1) {
        setCurrentSlide(currentSlide + 1)
      } else {
        setCurrentSlide(0)
      }
    }, interval)

    return () => clearTimeout(timer)
  }, [currentSlide, interval, sliderLength])

  return { currentSlide, handleSlide }
}

export default useSlider
