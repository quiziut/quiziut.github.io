var version_c = document.getElementById('lastupdate')

let version_request = fetch('./JSON_CONTENT/version.json', {
	method: 'GET',
  credentials: 'include'
}).then(function (response) {
	return response.json()
}).then(function (versions) {
  version_c.innerHTML += ' ' + versions['version']
})

var general_score = 0

if(localStorage.getItem('general_score') == null) localStorage.setItem('general_score', general_score)
else general_score = localStorage.getItem('general_score')

var score_c = document.getElementById('score')
var inscore_c = document.getElementById('inscore')
var clickcount = 0

function updateScore() {
	inscore_c.innerHTML = general_score
}

updateScore()

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