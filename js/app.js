var version_c = document.getElementById('lastupdate')

let version_request = fetch('./JSON_CONTENT/version.json', {
	method: 'GET',
  credentials: 'include'
}).then(function (response) {
	return response.json()
}).then(function (versions) {
  version_c.innerHTML += ' ' + versions['version']
})
