/* Мобильное меню */
const menuButton = document.querySelector(".menu-button")
const nav = document.querySelector(".nav")

function setMenu(open) {
  menuButton.classList.toggle("is-open", open)
  nav.classList.toggle("is-open", open)
  document.body.classList.toggle("menu-lock", open)
  menuButton.setAttribute("aria-expanded", String(open))
  menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню")
}

menuButton.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")))

document.querySelectorAll(".nav a, .site-header .brand").forEach((link) => {
  link.addEventListener("click", () => setMenu(false))
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false)
})

window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false)
})

/* Страница «Портфолио»: фильтр и просмотр фото */
const pfGrid = document.querySelector(".pf-grid")

if (pfGrid) {
  const items = [...pfGrid.querySelectorAll(".pf-item")]
  const filterButtons = document.querySelectorAll(".pf-filter button")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter
      filterButtons.forEach((b) => b.classList.toggle("is-active", b === button))
      items.forEach((item) => {
        item.hidden = category !== "all" && item.dataset.category !== category
      })
    })
  })

  const box = document.querySelector(".lightbox")
  const boxImage = box.querySelector("img")
  const boxCaption = box.querySelector("figcaption")
  let visibleItems = []
  let index = 0

  function showPhoto(i) {
    index = (i + visibleItems.length) % visibleItems.length
    const item = visibleItems[index]
    const img = item.querySelector("img")
    boxImage.src = item.querySelector("a").getAttribute("href")
    boxImage.alt = img.alt
    boxCaption.textContent = item.querySelector("figcaption").innerText.replace(/\s*\n\s*/g, " · ")
  }

  function openBox(item) {
    visibleItems = items.filter((it) => !it.hidden)
    box.hidden = false
    document.body.classList.add("menu-lock")
    showPhoto(visibleItems.indexOf(item))
  }

  function closeBox() {
    box.hidden = true
    document.body.classList.remove("menu-lock")
  }

  items.forEach((item) => {
    item.querySelector("a").addEventListener("click", (event) => {
      event.preventDefault()
      openBox(item)
    })
  })

  box.querySelector(".prev").addEventListener("click", () => showPhoto(index - 1))
  box.querySelector(".next").addEventListener("click", () => showPhoto(index + 1))
  box.querySelector(".lightbox-close").addEventListener("click", closeBox)
  box.addEventListener("click", (event) => {
    if (event.target === box) closeBox()
  })

  document.addEventListener("keydown", (event) => {
    if (box.hidden) return
    if (event.key === "Escape") closeBox()
    if (event.key === "ArrowLeft") showPhoto(index - 1)
    if (event.key === "ArrowRight") showPhoto(index + 1)
  })
}

/* Условия съёмки: окно по клику на «Подробнее» */
const serviceModal = document.querySelector(".service-modal")

if (serviceModal) {
  const modalTitle = serviceModal.querySelector("#service-modal-title")
  const closeButton = serviceModal.querySelector(".service-modal-close")
  let lastLink = null

  function openServiceModal(link) {
    lastLink = link
    modalTitle.textContent = link.closest(".service-card").querySelector("h3").textContent
    serviceModal.hidden = false
    document.body.classList.add("menu-lock")
    closeButton.focus()
  }

  function closeServiceModal() {
    serviceModal.hidden = true
    document.body.classList.remove("menu-lock")
    if (lastLink) lastLink.focus({ preventScroll: true })
  }

  document.querySelectorAll(".service-card .service-copy a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault()
      openServiceModal(link)
    })
  })

  closeButton.addEventListener("click", closeServiceModal)

  serviceModal.addEventListener("click", (event) => {
    if (event.target === serviceModal) closeServiceModal()
  })

  // Кнопка «Записаться»: закрываем окно, страница сама прокрутится к контактам
  serviceModal.querySelector(".outline-link").addEventListener("click", () => {
    serviceModal.hidden = true
    document.body.classList.remove("menu-lock")
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !serviceModal.hidden) closeServiceModal()
  })
}
