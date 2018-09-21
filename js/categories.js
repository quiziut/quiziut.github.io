var categories_c = document.getElementById('categories_container')

function rItems() {
  localStorage.clear()
}

let video_request = fetch('./JSON_CONTENT/categories.json', {
	method: 'GET',
  credentials: 'include'
}).then(function (response) {
	return response.json()
}).then(function (categories) {
  for(var i = 0; i < categories['categories'].length; i++) {
    var category = document.createElement('a')
    category.setAttribute('href', 'category.html?c=' + categories['categories'][i].toLowerCase())
    category.classList.add('category')
    category.innerHTML = categories['categories'][i]
    categories_c.appendChild(category)
  }
})
