window.addEventListener('DOMContentLoaded', () => {
  
      //Tabs

      const tabsContent = document.querySelectorAll('.tabcontent'),
            tabs = document.querySelectorAll('.tabheader__item'),
            tabsParent = document.querySelector('.tabheader__items')
      
      const hideTabContent = () => {
            tabsContent.forEach( item => {
                  item.classList.add('hide')
                  item.classList.remove('fade')
            })
            tabs.forEach(item => {
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
                        if(item === target) {
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
                  'total' : t,
                  'days' : days,
                  'hours' : hours,
                  'minutes' : minutes,
                  'seconds' : seconds
            }
      }

      function getZero (num) {
            if (num >= 0 && num < 10){
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

            function updateClock () {
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
            modalAlert = document.querySelector('.modal'),
            modalClose = document.querySelector('[data-close]')

      function showModal() {
            modalAlert.classList.add('show')
            modalAlert.classList.remove('hide')
            document.body.style.overflow = 'hidden'
            clearInterval(modalTimerId)
      }

      modalTrigger.forEach(btn => {
            btn.addEventListener('click', showModal)
      })

      function closeModal() {
            modalAlert.classList.add('hide')
            modalAlert.classList.remove('show')
            document.body.style.overflow = ''
      }

      modalClose.addEventListener('click', closeModal)

      modalAlert.addEventListener('click', (e) => {
            if (e.target === modalAlert) {
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
            if (window.pageYOffset + document.documentElement.clientHeight >= document.
                  documentElement.scrollHeight) {
                        showModal()
                        window.removeEventListener('scroll', showModalByScroll)
            }
      }

      window.addEventListener('scroll', showModalByScroll)

      //Use Card's Classes
      
      class MenuCard {
            constructor(src, alt, title, descr, price, parentSelector) {
                  this.src = src
                  this.alt = alt
                  this.title = title
                  this.descr = descr
                  this.price = price
                  this.parent = document.querySelector(parentSelector)
                  this.transfer = 27
                  this.changeToUAH()
            }

            changeToUAH() {
                  this.price = this.price * this.transfer
            }

            render() {
                 const element = document.createElement('div') 
                 element.innerHTML = `
                        <div class="menu__item">
                              <img src=${this.src} alt=${this.alt}>
                              <h3 class="menu__item-subtitle">${this.title}</h3>
                              <div class="menu__item-descr">${this.descr}</div>
                              <div class="menu__item-divider"></div>
                              <div class="menu__item-price">
                              <div class="menu__item-cost">Цена:</div>
                              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                              </div>
                        </div>
                 `
                 this.parent.append(element)
            }
      }
      new MenuCard(
            "img/tabs/vegy.jpg",
            "vegy",
            'Меню "Фитнес"',
            'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
            9,
            ".menu .container"
      ).render()

      new MenuCard(
            "img/tabs/elite.jpg",
            "elite",
            'Меню “Премиум”',
            'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
            14,
            ".menu .container"
      ).render()

      new MenuCard(
            "img/tabs/post.jpg",
            "post",
            'Меню "Постное"',
            'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
            21,
            ".menu .container"
      ).render()
})