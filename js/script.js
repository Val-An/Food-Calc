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

      modalTrigger.forEach(btn => {
            btn.addEventListener('click', () => {
                  modalAlert.classList.add('show')
                  modalAlert.classList.remove('hide')
                  document.body.style.overflow = 'hidden'
            })
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
      
});