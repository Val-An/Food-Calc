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

  const modalTimerId = setTimeout(showModal, 10000)

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

  getResource('http://localhost:3000/menu')
		.then(data => {
		  data.forEach(({img, altimg, title, descr, price}) => {
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
})
