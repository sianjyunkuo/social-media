(function () {

  const dataPanel = document.getElementById('data-panel')

  // SKIP(access data by axios)
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const data = []
  let pageNow = 1

  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  const manuBar = document.getElementById('navbarSupportedContent')

  let paginationData = []
  let pageChose = ''

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  // listen to search btn click event
  searchBtn.addEventListener('click', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    if (pageChose === 'favorite') {
      const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
      results = list.filter(user => user.name.match(regex))
    } else {
      results = data.filter(user => user.name.match(regex))
    }
    console.log(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    console.log(event.target.dataset.id)
    if (event.target.matches('.btn-show-user')) {
      showUser(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  manuBar.addEventListener('click', event => {
    if (event.target.matches('#allusers')) {
      pageChose = ''
      getTotalPages(data)
      getPageData(currentPage, data)
    } else if (event.target.matches('#favorite')) {
      const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
      pageChose = event.target.id
      getTotalPages(list)
      getPageData(currentPage, list)
    }
  })

  // Function show user detail
  function showUser(id) {
    // get elements
    const modalTitle = document.getElementById('show-title')
    const modalAvatar = document.getElementById('show-avatar')
    const modalDate = document.getElementById('show-movie-date')
    const modalEmail = document.getElementById('show-email')
    const modalBirthday = document.getElementById('show-birthday')
    const modalAge = document.getElementById('show-age')
    const modalGender = document.getElementById('show-gender')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.name
      modalAvatar.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `Surname : ${data.surname}`
      modalAge.textContent = `Age : ${data.age}`
      modalGender.textContent = `Gender : ${data.gender}`
      modalEmail.textContent = `Email : ${data.email}`
      modalBirthday.textContent = `Birthday : ${data.birthday}`

    })
  }

  //Display List
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class = "card mb-2">
            <img class= "card-img-top " src= "${item.avatar}" alt="Card image cap">
            <div class = "card-body movie-item-body">
              <h6 class="card-title">${item.name}</h6>
            </div>
         
            <div class= "card-footer">
              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#show-user-modal" data-id = "${item.id}">Information</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function addFavoriteItem(id) {
    let list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    const user = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${user.name} is already in your favorite list.`)
    } else {
      list.push(user)
      alert(`Added ${user.name} to your favorite list!`)
    }
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
  }
  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      pageNow = event.target.dataset.page
      getPageData(event.target.dataset.page)
    }
  })


  axios
    .get(`https://lighthouse-user-api.herokuapp.com/api/v1/users`)
    .then((response) => {
      data.push(...response.data.results)
      getTotalPages(data)
      getPageData(pageNow, data)
    })
    .catch((err) => console.log(err))
})()