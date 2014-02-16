$(document).ready(function(){

  $('form').submit(function(e){
    e.preventDefault()
    e.target.remove()
    var github_username = e.target.children[1].value
    gitLastCommitTime(github_username, setTheClock)
  })


})


function gitLastCommitTime(username,callback){
  var base_url = "https://github.com/"+username+".json"
  $.ajax({
    url: base_url,
    dataType: 'jsonp',
    success: callback
  })
}

function setTheClock(response){
  var date_today = new Date(),
      start_of_day = Date.parse(date_today.toLocaleDateString()),
      end_of_day = start_of_day + 86400000,
      last_commit_time = Date.parse(response[0].created_at),
      // time_since_last_commit = Date.now() - last_commit_time,
      milliseconds_past_today = date_today.valueOf() - start_of_day,
      milliseconds_left = 86400000 - milliseconds_past_today

  if (last_commit_time >= start_of_day) {
    milliseconds_left += 86400000 // i.e. add a day
  }

  var total_seconds = Math.round(milliseconds_left/1000),
      hours = Math.floor(total_seconds/60/60),
      minutes = Math.floor(total_seconds/60)%60,
      seconds = Math.floor(total_seconds)%60
  
  startTheClock(hours,minutes,seconds)
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
