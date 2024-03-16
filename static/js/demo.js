var v = document.getElementById("Test_Video");
var total_divs_added = 0;
var shots_added = 0;
var previous_time = 0;

function loadingVideo(time) {
  v.currentTime = time;
}
function speed(rate) {
  v.playbackRate = rate;
}
function jump(time) {
  v.currentTime += time;
}

var counter = 0;
function next() {
  var list = document.getElementById("future_shots");
  while (list.childNodes[counter].length == 18 && counter < list.childNodes.length) {
    counter += 1;
  }
  var time = list.childNodes[counter].textContent;
  time = time.split(',')[0];
  if (v.currentTime > +time - 2) {
    counter += 1;
    return next()
  }
  v.currentTime = time;
  v.pause();
  counter += 1;

}


var counterLabel = 0;
var shot_id = 'future_shots_ken_ten'
function nextLabel() {
  console.log(shot_id);
  var list = document.getElementById(shot_id);
  while (list.childNodes[counterLabel].length == 18 && counterLabel < list.childNodes.length) {
    counterLabel += 1;
  }
  var element = list.childNodes[counterLabel].textContent;
  var time = element.split(',')[0];
  var end_time = element.split(',')[1];
  var predicted_timestamp = element.split(',')[2];
  var shot_confidence = element.split(',')[3];
  var shot_cluster = parseInt(element.split(',')[4]) + 1;
  var shot_quality = element.split(',')[5];
  var side = element.split(',')[6];
  if (parseFloat(side) < 0.5) {
    var flip = false;
  }
  else {
    var flip = true;
  }
  if (v.currentTime > +time - 2) {
    counterLabel += 1;
    return nextLabel()
  }

  v.currentTime = time;
  v.pause();
  counterLabel += 1;

  var text = document.getElementById("shot_binary");
  //format to only be 2 decimal places
  text.innerHTML = 'Shot Taken Confidence: ' + parseFloat(shot_confidence).toFixed(2);
  var text = document.getElementById("shot_timestamp");
  text.innerHTML = 'Precise Shot Time Stamp: ' + predicted_timestamp;
  var text = document.getElementById("shot_quality");
  text.innerHTML = 'Shot Quality: ' + parseFloat(shot_quality).toFixed(2);;;


  change_picture(shot_cluster, flip);
  // hide the next button
  document.getElementById("Next").style.backgroundColor = 'gray';
  //disable the onlick
  document.getElementById("Next").onclick = null;
  v.play();
  //sleep for 4 seconds
  setTimeout(() => {
    v.pause();
    document.getElementById("Next").style.backgroundColor = 'blue';
    document.getElementById("Next").onclick = nextLabel;
  }, 4000);

}

function changeVideo() {
  v = document.getElementById("Test_Video");
  var video = document.getElementById("game_select").value;
  const id_to_video = {
    "Ken_Ten": '../static/videos/Ken_Ten_Jan_15_2022.mp4',
    "LSU_UMKC": '../static/videos/LSU_UMKC_Nov_9_2022.mp4',
    "UNC_Duke": "../static/videos/UNC_v_Duke_apr_24_2022.mp4",
  }
  v.src = id_to_video[video];
  v.load();
  v.pause();
  counterLabel = 0;
  if (video == 'Ken_Ten') {
    shot_id = 'future_shots_ken_ten';
  }
  else if (video == 'LSU_UMKC') {
    shot_id = 'future_shots_lsu_umkc';
  }
  else if (video == 'UNC_Duke') {
    shot_id = 'future_shots_unc_duke';
  }
}

function change_picture(cluster, flip = false) {
  directory = '../static/court_locations/'

  const cluster_to_file = {
    1: directory + 'left_paint.jpeg', 2: directory + 'left_left_mid_range.jpeg',
    3: directory + 'left_right_mid_range.jpeg',
    4: directory + 'left_middle_mid_range.jpeg',
    5: directory + 'left_right_three.jpeg', 6: directory + 'left_middle_three.jpeg',
    7: directory + 'left_left_three.jpeg'
  }
  if (cluster == 1) {
    var prompt = 'Shot in the paint';
  } else if (cluster == 2 || cluster == 3) {
    var prompt = 'Mid-Range on the wing';
  } else if (cluster == 4) {
    var prompt = 'Mid-Range top of the key';
  } else if (cluster == 5 || cluster == 7) {
    var prompt = '3-Pointer from wing';
  } else if (cluster == 6) {
    var prompt = '3-Pointer from top of the key';
  }

  //set the text to be the prompt
  var text = document.getElementById("shot_type");
  text.innerHTML = 'Shot Location: <b>' + prompt + "</b>";

  var img = document.getElementById("court");

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  var image = new Image();

  image.src = cluster_to_file[cluster];
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;

    if (flip) {
      ctx.scale(-1, 1);
      ctx.drawImage(image, -image.width, 0);
    } else {
      ctx.drawImage(image, 0, 0);
    }

    img.src = canvas.toDataURL();
  };
}
