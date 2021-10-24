function showModal(modalSelector, modalTimerId) {
  const modalAlert = document.querySelector(modalSelector)
  modalAlert.classList.add('show')
  modalAlert.classList.remove('hide')
  document.body.style.overflow = 'hidden'
  if (modalTimerId){
	 clearInterval(modalTimerId)
  }
}

function closeModal(modalSelector) {
  const modalAlert = document.querySelector(modalSelector)
  modalAlert.classList.add('hide')
  modalAlert.classList.remove('show')
  document.body.style.overflow = ''
}

function modal(triggerSelector, modalSelector, modalTimerId) {
  //modal

  const modalTrigger = document.querySelectorAll(triggerSelector),
		modalAlert = document.querySelector(modalSelector)


  modalTrigger.forEach((btn) => {
	 btn.addEventListener('click', () => showModal(modalSelector, modalTimerId))
  })

  modalAlert.addEventListener('click', (e) => {
	 if (e.target === modalAlert || e.target.getAttribute('data-close') === '') {
		closeModal(modalSelector)
	 }
  })

  document.addEventListener('keydown', (e) => {
	 if (e.code === 'Escape' && modalAlert.classList.contains('show')) {
		closeModal(modalSelector)
	 }
  })



  function showModalByScroll() {
	 if (
		  window.pageYOffset + document.documentElement.clientHeight >=
		  document.documentElement.scrollHeight
	 ) {
		showModal(modalSelector, modalTimerId)
		window.removeEventListener('scroll', showModalByScroll)
	 }
  }

  window.addEventListener('scroll', showModalByScroll)
}

export default modal
export {showModal}
export {closeModal}