var categories_c = document.getElementById('categories_container')

function rItems() {
  localStorage.clear()
}

var score_c = document.getElementById('score')
var general_score = 0

var clickcount = 0

if(localStorage.getItem('general_score') == null) localStorage.setItem('general_score', general_score)
else general_score = localStorage.getItem('general_score')

function updateScore() {
	score_c.innerHTML = general_score
}

updateScore()

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

score_c.addEventListener('click', () => {
	clickcount++
	console.log(localStorage.getItem('score_click_found'))
	if(clickcount == 10 && localStorage.getItem('score_click_found') != "true") {
		general_score = parseInt(general_score)
		general_score += 100
		localStorage.setItem('general_score', general_score)
		updateScore()
		localStorage.setItem('score_click_found', true)
	}
})
