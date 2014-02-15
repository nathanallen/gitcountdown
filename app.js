$(document).ready(function(){

  $('form').submit(function(e){
    e.preventDefault()
    e.target.remove()
    var username = e.target.children[0].value
    
    getLastCommitTime(username, function(response){
      var date_today = new Date()
      var last_commit_time = Date.parse(response[0].created_at),
          time_since_last_commit = Date.now() - last_commit_time
          //pst is utc-8
      if (time_since_last_commit < 84600000){
        var currentTimeZoneOffsetInHours = date_today.getTimezoneOffset() / 60;
        console.log(currentTimeZoneOffsetInHours)
      }

    })

  })


})


function getLastCommitTime(username,callback){
  var base_url = "https://github.com/"+username+".json"
  $.ajax({
    url: base_url,
    dataType: 'jsonp',
    success: callback
  })
}

// var base_url = "https://github.com/users/"+username+"/contributions_calendar_data"
