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
  var day_in_ms = 86400000,
      date_today = new Date(),
      pst_timezone_offset = 480, //PST is utc -8. (Ignoring Daylight Savings).
      current_timezone_offset = date_today.getTimezoneOffset(),
      timezone_offset_difference_ms = (current_timezone_offset - pst_timezone_offset)*60*1000
      start_of_day_utc = Date.parse(date_today.toLocaleDateString())
      milliseconds_past_today = date_today.valueOf() - start_of_day_utc,
      milliseconds_past_in_pst = milliseconds_past_today + timezone_offset_difference_ms
      milliseconds_left = (day_in_ms - milliseconds_past_in_pst)%day_in_ms

  if (last_commit_date && (last_commit_date >= start_of_day_utc)) {
    milliseconds_left += day_in_ms // i.e. add a day
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
  setTextColor(hours)

  interval = setInterval(function(){
    var h = hours,
        m = (minutes < 10 ? "0" : "") + minutes,
        s = (seconds < 10 ? "0" : "") + seconds
    
    $('.h').html(h)
    $('.m').html(m)
    $('.s').html(s)

    if (seconds == 0){
      if (minutes == 0){
        if (hours == 0){
          alert("Time's up!")
        } else {
          hours--
          minutes = 59
          seconds = 59
          setTextColor(hours)
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

function setTextColor(hours){
  var text_color;

  switch (true){
    case (hours < 3):
      text_color = 'red'
      break;
    case (hours < 6):
      text_color = 'orange'
      break;
    case (hours < 12):
      text_color = 'gold'
      break;
    case (hours < 24):
      text_color = 'yellowgreen'
      break;
    default:
      text_color = 'green'
  }

  $('.countdown_section').css('color',text_color)
}

// var base_url = "https://github.com/users/"+username+"/contributions_calendar_data"
