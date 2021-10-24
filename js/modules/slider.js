function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
  //slider

  const slides = document.querySelectorAll(slide),
		slider = document.querySelector(container),
		prev = document.querySelector(prevArrow),
		next = document.querySelector(nextArrow),
		current = document.querySelector(currentCounter),
		total = document.querySelector(totalCounter),
		slidesWrapper = document.querySelector(wrapper),
		slidesField = document.querySelector(field),
		width = window.getComputedStyle(slidesWrapper).width

  let slidesIndex = 1
  let offset = 0

  if (slides.length < 10){
	 total.textContent = `0${slides.length}`
	 current.textContent = `0${slidesIndex}`
  } else {
	 total.textContent = slides.length
	 current.textContent = slidesIndex
  }

  slidesField.style.width = 100 * slides.length + '%'
  slidesField.style.display = 'flex'
  slidesField.style.transition = '0.5s all'

  slidesWrapper.style.overflow = 'hidden'


  slides.forEach(slide => {
	 slide.style.width = width
  })

  slider.style.position = 'relative'

  const indicators = document.createElement('ol'),
		dots = []
  indicators.classList.add('carousel-indicators')
  slider.append(indicators)

  for (let i = 0; i < slides.length; i++){
	 const dot = document.createElement('li')
	 dot.setAttribute('data-slide-to', i + 1)
	 dot.classList.add('dot')
	 if (i === 0){
		dot.style.opacity = 1
	 }
	 indicators.append(dot)
	 dots.push(dot)
  }

  function deleteNoDigits(str) {
	 return +str.replace(/\D/g, '')
  }

  next.addEventListener('click', () => {
	 if (offset === deleteNoDigits(width) * (slides.length - 1)){
		offset = 0
	 } else {
		offset += deleteNoDigits(width)
	 }

	 slidesField.style.transform = `translateX(-${offset}px)`

	 if (slidesIndex === slides.length){
		slidesIndex = 1
	 } else {
		slidesIndex++
	 }

	 if (slides.length < 10){
		current.textContent = `0${slidesIndex}`
	 } else {
		current.textContent = slidesIndex
	 }

	 dots.forEach(dot => dot.style.opacity = '.5')
	 dots[slidesIndex - 1].style.opacity = 1
  })

  prev.addEventListener('click', () => {
	 if (offset === 0){
		offset = deleteNoDigits(width) * (slides.length - 1)
	 } else {
		offset -= deleteNoDigits(width)
	 }

	 slidesField.style.transform = `translateX(-${offset}px)`

	 if (slidesIndex === 1){
		slidesIndex = slides.length
	 } else {
		slidesIndex--
	 }

	 if (slides.length < 10){
		current.textContent = `0${slidesIndex}`
	 } else {
		current.textContent = slidesIndex
	 }

	 dots.forEach(dot => dot.style.opacity = '.5')
	 dots[slidesIndex - 1].style.opacity = 1
  })

  dots.forEach(dot => {
	 dot.addEventListener('click', (e) => {
		const slideTo = e.target.getAttribute('data-slide-to')

		slidesIndex = slideTo
		offset = deleteNoDigits(width) * (slideTo - 1)

		slidesField.style.transform = `translateX(-${offset}px)`

		if (slides.length < 10){
		  current.textContent = `0${slidesIndex}`
		} else {
		  current.textContent = slidesIndex
		}

		dots.forEach(dot => dot.style.opacity = '.5')
		dots[slidesIndex - 1].style.opacity = 1
	 })
  })
}

export default slider