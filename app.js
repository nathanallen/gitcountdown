$(document).ready(function(){
  $('form').submit(displayCountdownClock)
})


function displayCountdownClock(e){
  e.preventDefault()
  e.target.remove()
  var github_username = e.target.children[1].value
  getUserData(github_username, setTheClock)
}

function getUserData(username,callback){
  var base_url = "https://github.com/"+username+".json"
  $.ajax({
    url: base_url,
    dataType: 'jsonp',
    success: callback
  })
}

function setTheClock(githubUserData){
  var last_commit_time = find_last_commit_time(githubUserData),
      time_left = calculateTimeLeft(last_commit_time),
      total_minutes = time_left/60,

      hours = Math.floor(total_minutes/60),
      minutes = Math.floor(total_minutes)%60,
      seconds = time_left%60

  startTheClock(hours,minutes,seconds)
}

function find_last_commit_time(githubUserData){
  githubUserData.forEach(function(item,i){
    if (item.type == "PushEvent"){ // What else counts as a commit?
      return Date.parse(item.created_at)
    }
  })
}

function calculateTimeLeft(time_of_last_commit){
  var date_today = new Date(),
      start_of_day = Date.parse(date_today.toLocaleDateString()),
      milliseconds_past_today = date_today.valueOf() - start_of_day,
      milliseconds_left = 86400000 - milliseconds_past_today

  if (time_of_last_commit >= start_of_day) {
    milliseconds_left += 86400000 // i.e. add a day
  }

  return Math.round(milliseconds_left/1000)
}

function startTheClock(hours,minutes,seconds){
  setInterval(function(){
    var display = hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    
    $('.countdown').html(display)
    
    if (seconds == 0){
      if (minutes == 0){
        if (hours == 0){
          alert("Time's up!")
        } else {
          hours--
          minutes = 59
          seconds = 59
        }
      } else {
        minutes--
        seconds = 59
      }
    } else {
      seconds--
    }

  },1000)
}

// var base_url = "https://github.com/users/"+username+"/contributions_calendar_data"
