var question_c = document.getElementById('question_container')
var timer = document.getElementById('timer')
var passed = document.getElementById('passed')

var url_string = window.location.href
var url = new URL(url_string)
let toFetch = url.searchParams.get('c')

var current = 0
var score = 0
var general_score = 0

var passedQ = []

function Timer(fn, t) {
    var timerObj = setInterval(fn, t)

    this.stop = function() {
        if (timerObj) {
            clearInterval(timerObj)
            timerObj = null
        }
        return this
    }

    this.start = function() {
        if (!timerObj) {
            this.stop()
            timerObj = setInterval(fn, t)
        }
        return this
    }

    this.reset = function(newT) {
        t = newT
        return this.stop().start()
    }
}

function updateItems() {
  localStorage.setItem(toFetch + '_score', score)
  localStorage.setItem('general_score', general_score)
}

if(localStorage.getItem(toFetch + '_score') == null) updateItems()

if(localStorage.getItem('general_score') == null) {
	console.log('set general score to 0')
	updateItems()
}
else {
	general_score = localStorage.getItem('general_score')
	console.log('get general score ' + general_score)
}

window.onload = () => {
  request()
}

function clearWindow() {
  while (question_c.firstChild) {
    question_c.removeChild(question_c.firstChild)
  }
}

function chooseQuestion(questions) {
	var keys = Object.keys(questions)
	var choosen = Math.floor(Math.random() * (keys.length))
	if(current != 0) {
		for(var i = 0; i < passedQ.length; i++) {
			if(choosen == passedQ[i]) {
				return chooseQuestion(questions)
			}
		}
	}
	passedQ[current] = choosen
	return choosen
}

function answerClicked(answer, rightOne) {
  if(answer == rightOne) {
	  score++
	  general_score++
  }
  current++
	updateScore()
	updateItems()
  clearWindow()
  cpt = originalCpt
  request()
}

var cpt = 20
let originalCpt = cpt

var timer = new Timer(function() {
  cpt--
  if(cpt == 0) {
      timer.stop()
      cpt = originalCpt
      answerClicked(-1, 0)
  }
  passed.style.width = (((originalCpt - cpt)/originalCpt)*106) + '%'
}, 1000)

function buildQuesion(questions) {
  var keys = Object.keys(questions)
  var answers_table = []
  if(current < 10) {
	  setTimeout(() => {
		cpt = originalCpt
		timer.start()
	  }, 1000)
	var question = chooseQuestion(questions)
	var question_array = questions[keys[question]]
    var question = document.createElement('h2')
    question.classList.add('question')
    question.innerHTML = question_array['question']
    var answers = document.createElement('div')
    answers.classList.add('answers')
    for(var i = 0; i < question_array['answers'].length; i++) {
      var answer = document.createElement('div')
      answer.innerHTML = question_array['answers'][i]
      answer.setAttribute('n', i)
      answer.classList.add('answer')
      answers.appendChild(answer)
      answers_table[i] = answer
    }

    question_c.appendChild(question)
    question_c.appendChild(answers)
  } else {
    var endi = document.createElement('h2')
    endi.classList.add('question')
    endi.innerHTML = 'Votre score est de ' + score + ' / 10'

    var homeLink = document.createElement('a')
    homeLink.classList.add('homeLink')
    homeLink.setAttribute('href', 'index.html')
    homeLink.innerHTML = 'Revenir à l\'accueil'

    question_c.appendChild(endi)
    question_c.appendChild(homeLink)
  }

  for(var i = 0; i < answers_table.length; i++) {
    let currentAnswer = answers_table[i]

    answers_table[i].addEventListener('click', () => {
      answerClicked(currentAnswer.getAttribute('n'), question_array['right_answer'])
    })
  }
}

function request() {
  let video_request = fetch('./JSON_CONTENT/categories/' + toFetch + '.json', {
  	method: 'GET',
    credentials: 'include'
  }).then(function (response) {
  	return response.json()
  }).then(function (questions) {
    buildQuesion(questions)
  })
}
