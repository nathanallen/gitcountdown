$(document).ready(function(){
  calculateTimeLeft(setTheClock)
  $('form').submit(displayUserCountdown)
})

function displayUserCountdown(e){
  e.preventDefault()
  e.target.remove()
  var github_username = e.target.children[1].value
  getLastCommitDate(github_username, function(last_commit_date){
    calculateTimeLeft(setTheClock,last_commit_date)
  })
}

function getLastCommitDate(username,callback){
  var base_url = "https://github.com/"+username+".json"
  $.ajax({
    url: base_url,
    dataType: 'jsonp',
    success: function(data){
      findLastCommitDate(data,callback)
    }
  })  
}

function findLastCommitDate(data,callback){
  var max = data.length
  for (var i=0; i<max; i++){
    if (data[i].type == "PushEvent"){ // What else counts as a commit?
      var date = Date.parse(data[i].created_at)
      return callback(date)
    }
  }
}


function calculateTimeLeft(callback,last_commit_date){
  var date_today = new Date(),
      start_of_day = Date.parse(date_today.toLocaleDateString()),
      milliseconds_past_today = date_today.valueOf() - start_of_day,
      milliseconds_left = 86400000 - milliseconds_past_today

  if (last_commit_date && (last_commit_date >= start_of_day)) {
    milliseconds_left += 86400000 // i.e. add a day
    $('.prompt').html("You're in the clear!")
  }
    
  callback(milliseconds_left)
}

function setTheClock(time_left){
  var total_minutes = Math.round(time_left/1000/60),
      hours = Math.floor(total_minutes/60),
      minutes = Math.floor(total_minutes)%60,
      seconds = time_left%60

  startTheClock(hours,minutes,seconds)
}

var interval;

function startTheClock(hours,minutes,seconds){
  clearInterval(interval)
  interval = setInterval(function(){
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
