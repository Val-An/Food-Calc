function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
	//Tabs
  const tabs = document.querySelectorAll(tabsSelector),
		  tabsContent = document.querySelectorAll(tabsContentSelector),
		  tabsParent = document.querySelector(tabsParentSelector)

  const hideTabContent = () => {
	 tabsContent.forEach((item) => {
		item.classList.add('hide')
		item.classList.remove('fade')
	 })
	 tabs.forEach((item) => {
		item.classList.remove(activeClass)
	 })
  }

  const showTabContent = (i = 0) => {
	 tabsContent[i].classList.add('show', 'fade')
	 tabsContent[i].classList.remove('hide')
	 tabs[i].classList.add(activeClass)
  }

  tabsParent.addEventListener('click', (event) => {
	 let target = event.target
	 if (target && target.classList.contains(tabsSelector.slice(1))) {
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
}

export default tabs