var question_c = document.getElementById('question_container')
var timer = document.getElementById('timer')
var passed = document.getElementById('passed')

var url_string = window.location.href
var url = new URL(url_string)
let toFetch = url.searchParams.get('c')

var current = 0
var score = 0
var general_score = 0

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
  localStorage.setItem(toFetch + '_question_number', current)
  localStorage.setItem(toFetch + '_score', score)
  localStorage.setItem('general_score', general_score)
}

if(localStorage.getItem(toFetch + '_question_number') == null) updateItems()
else current = localStorage.getItem(toFetch + '_question_number')

if(localStorage.getItem(toFetch + '_score') == null) updateItems()
else score = localStorage.getItem(toFetch + '_score')

if(localStorage.getItem('general_score') == null) updateItems()
else general_score = localStorage.getItem('general_score')

window.onload = () => {
  request()
}

function clearWindow() {
  while (question_c.firstChild) {
    question_c.removeChild(question_c.firstChild)
  }
}

function answerClicked(answer, rightOne) {
  if(answer == rightOne) {
	  score++
	  general_score++
  }
  current++
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
  if(current < keys.length) {
	  setTimeout(() => {
		cpt = originalCpt
		timer.start()
	  }, 1000)
    var question_array = questions[keys[current]]
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
    endi.innerHTML = 'Vous avez fini les questions pour l\'instant! Votre score actuel est de ' + Math.round(score / keys.length * 100) + '%'

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
