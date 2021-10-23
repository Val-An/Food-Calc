window.addEventListener('DOMContentLoaded', () => {

  //Tabs

  const tabsContent = document.querySelectorAll('.tabcontent'),
		tabs = document.querySelectorAll('.tabheader__item'),
		tabsParent = document.querySelector('.tabheader__items')

  const hideTabContent = () => {
	 tabsContent.forEach((item) => {
		item.classList.add('hide')
		item.classList.remove('fade')
	 })
	 tabs.forEach((item) => {
		item.classList.remove('tabheader__item_active')
	 })
  }

  const showTabContent = (i = 0) => {
	 tabsContent[i].classList.add('show', 'fade')
	 tabsContent[i].classList.remove('hide')
	 tabs[i].classList.add('tabheader__item_active')
  }

  tabsParent.addEventListener('click', (event) => {
	 let target = event.target
	 if (target && target.classList.contains('tabheader__item')) {
		tabs.forEach((item, i) => {
		  if (item === target) {
			 hideTabContent()
			 showTabContent(i)
		  }
		})
	 }
  })

  hideTabContent()
  showTabContent()

  //Timer

  const deadline = '2021-10-01'

  const getTimeRemaining = (endtime) => {
	 const t = Date.parse(endtime) - Date.parse(new Date()),
		  days = Math.floor(t / (1000 * 60 * 60 * 24)),
		  hours = Math.floor((t / (1000 * 60 * 60)) % 24),
		  minutes = Math.floor((t / (1000 * 60)) % 60),
		  seconds = Math.floor((t / 1000) % 60)

	 return {
		total: t,
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: seconds,
	 }
  }

  function getZero(num) {
	 if (num >= 0 && num < 10) {
		return `0${num}`
	 } else {
		return num
	 }
  }

  const setClock = (selector, endtime) => {
	 const timer = document.querySelector(selector),
		  days = timer.querySelector('#days'),
		  hours = timer.querySelector('#hours'),
		  minutes = timer.querySelector('#minutes'),
		  seconds = timer.querySelector('#seconds'),
		  timeInterval = setInterval(updateClock, 1000)

	 updateClock()

	 function updateClock() {
		const t = getTimeRemaining(endtime)

		days.innerHTML = getZero(t.days)
		hours.innerHTML = getZero(t.hours)
		minutes.innerHTML = getZero(t.minutes)
		seconds.innerHTML = getZero(t.seconds)

		if (t.total <= 0) {
		  clearInterval(timeInterval)

		  days.innerHTML = '00'
		  hours.innerHTML = '00'
		  minutes.innerHTML = '00'
		  seconds.innerHTML = '00'
		}
	 }
  }

  setClock('.timer', deadline)

  //modal

  const modalTrigger = document.querySelectorAll('[data-modal]'),
		modalAlert = document.querySelector('.modal')

  function showModal() {
	 modalAlert.classList.add('show')
	 modalAlert.classList.remove('hide')
	 document.body.style.overflow = 'hidden'
	 clearInterval(modalTimerId)
  }

  modalTrigger.forEach((btn) => {
	 btn.addEventListener('click', showModal)
  })

  function closeModal() {
	 modalAlert.classList.add('hide')
	 modalAlert.classList.remove('show')
	 document.body.style.overflow = ''
  }


  modalAlert.addEventListener('click', (e) => {
	 if (e.target === modalAlert || e.target.getAttribute('data-close') === '') {
		closeModal()
	 }
  })

  document.addEventListener('keydown', (e) => {
	 if (e.code === 'Escape' && modalAlert.classList.contains('show')) {
		closeModal()
	 }
  })

  const modalTimerId = setTimeout(showModal, 180000)

  function showModalByScroll() {
	 if (
		  window.pageYOffset + document.documentElement.clientHeight >=
		  document.documentElement.scrollHeight
	 ) {
		showModal()
		window.removeEventListener('scroll', showModalByScroll)
	 }
  }

  window.addEventListener('scroll', showModalByScroll)

  //Use Card's Classes

  class MenuCard {
	 constructor(src, alt, title, descr, price, parentSelector, ...classes) {
		this.src = src
		this.alt = alt
		this.title = title
		this.descr = descr
		this.price = price
		this.classes = classes
		this.parent = document.querySelector(parentSelector)
		this.transfer = 27
		this.changeToUAH()
	 }

	 changeToUAH() {
		this.price = this.price * this.transfer
	 }

	 render() {
		const element = document.createElement('div')

		if (this.classes.length === 0) {
		  this.element = 'menu__item'
		  element.classList.add(this.element)
		} else {
		  this.classes.forEach((className) => element.classList.add(className))
		}

		element.innerHTML = `<img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
               <div class="menu__item-cost">Цена:</div>
               <div class="menu__item-total"><span>${this.price}</span>грн/день</div>
            </div>`
		this.parent.append(element)
	 }
  }

  const getResource = async (url) => {
	 const res = await fetch(url)

	 if (!res.ok){
	   throw new Error(`Could not fetch ${url}, status: ${res.status}`)
	 }

	 return await res.json()
  }

  // getResource('http://localhost:3000/menu')
	// 	.then(data => {
	// 	  data.forEach(({img, altimg, title, descr, price}) => {
	// 	    new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
	// 	  })
	// 	})

  axios.get('http://localhost:3000/menu')
		.then(res => {
		  res.data.forEach(({img, altimg, title, descr, price}) => {
			 new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
		  })
		})


  //Forms

  const forms = document.querySelectorAll('form')

  const message = {
	 loading: 'img/form/spinner.svg',
	 success: 'Спасибо! Скоро мы с вами свяжемся.',
	 failure: 'Что-то пошло не так...',
  }

  forms.forEach((item) => {
	bindPostData(item)
  })

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
		headers: {
        'Content-type': 'application/json'
		},
		body: data
	 })
	 return await res.json()
  }

  function bindPostData(form) {
	 form.addEventListener('submit', (e) => {
		e.preventDefault()

		const statusMessage = document.createElement('img')
		statusMessage.src = message.loading
		statusMessage.classList.add('spinner')
		form.insertAdjacentElement('afterend', statusMessage)

		const formData = new FormData(form)

		const json = JSON.stringify(Object.fromEntries(formData.entries()))

		postData('http://localhost:3000/requests', json)
		  .then(data => {
		  console.log(data)
		  showThanksModal(message.success)
		  statusMessage.remove()
		}).catch(() => {
		  showThanksModal(message.failure)
		}).finally(() => {
		  form.reset()
		})
	 })
  }

  function showThanksModal(message) {
	 const prevModalDialog = document.querySelector('.modal__dialog')

	 prevModalDialog.classList.add('hide')
	 showModal()

	 const thanksModal = document.createElement('div')
	 thanksModal.classList.add('modal__dialog')
	 thanksModal.innerHTML = `
         <div class='modal__content'>
         <div class='modal__close' data-close></div>
         <div class='modal__title'>${message}</div>
         </div>
      `

	 document.querySelector('.modal').append(thanksModal)
	 setTimeout(() => {
		thanksModal.remove()
		prevModalDialog.classList.add('show')
		prevModalDialog.classList.remove('hide')
		closeModal()
	 }, 4000)
  }

  fetch('http://localhost:3000/menu')
		.then(data => data.json())
		.then(res => console.log(res))

  //slider 1

  /*const slides = document.querySelectorAll('.offer__slide'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		current = document.querySelector('#current'),
		total = document.querySelector('#total')
  let slidesIndex = 1

  showSlides(slidesIndex)

  if (slides.length < 10){
    total.textContent = `0${slides.length}`
  } else {
	 total.textContent = slides.length
  }

  function showSlides(n) {
		if (n > slides.length){
		  slidesIndex = 1
		}

		if (n < 1){
		  slidesIndex = slides.length
		}

		slides.forEach(item => item.style.display = 'none')
	 	slides[slidesIndex - 1].style.display = 'block'

	 if (slides.length < 10){
		current.textContent = `0${slidesIndex}`
	 } else {
		current.textContent = slidesIndex
	 }
  }

  function plusSlides(n) {
		showSlides(slidesIndex += n)
  }

  prev.addEventListener('click', () => {
    plusSlides(-1)
  })

  next.addEventListener('click', () => {
	 plusSlides(1)
  })*/

  //slider 2

  const slides = document.querySelectorAll('.offer__slide'),
		slider = document.querySelector('.offer__slider'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		current = document.querySelector('#current'),
		total = document.querySelector('#total'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
  		slidesField = document.querySelector('.offer__slider-inner'),
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

  //calc

  const result = document.querySelector(".calculating__result span")
  let sex = 'female',
		height,
		weight,
		age,
		ratio = 1.375

  function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio){
		  result.textContent = '----'
		  return
		}

		if (sex === 'female'){
		  result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio)
		} else {
		  result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio)
		}
  }

  calcTotal()

  function getStaticInformation(parentDelector, activeClass) {
    const elements = document.querySelectorAll(`${parentDelector} div`)

	 elements.forEach(elem => {
		elem.addEventListener('click', (e) => {
		  if (e.target.getAttribute('data-ratio')) {
			 ratio = +e.target.getAttribute('data-ratio')
		  } else {
			 sex = e.target.getAttribute('id')
		  }

		  elements.forEach(elem => {
			 elem.classList.remove(activeClass)
		  })
		  e.target.classList.add(activeClass)

		  calcTotal()
		})
	 })
  }

  getStaticInformation("#gender", "calculating__choose-item_active")
  getStaticInformation(".calculating__choose_big", "calculating__choose-item_active")

  function getDinamicInformation(selector) {
    const input = document.querySelector(selector)

	 input.addEventListener('input', () => {

	   if (input.value.match(/\D/g)){
	     input.style.border = '1px solid red'
		} else {
		  input.style.border = 'none'
		}

	   switch (input.getAttribute('id')) {
		  case 'height' : height = +input.value
			 break
		  case 'weight' : weight = +input.value
			 break
		  case 'age' : age = +input.value
			 break
		}

		calcTotal()
	 })
  }

  getDinamicInformation('#height')
  getDinamicInformation('#weight')
  getDinamicInformation('#age')

})
