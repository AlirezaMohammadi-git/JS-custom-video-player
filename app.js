const player = document.querySelector('.videoPlayer')
const playBtn = document.querySelector('#btn-play')
const forwardBtn = document.querySelector('#btn-forward')
const backwardBtn = document.querySelector('#btn-backward')
const videoRange = document.querySelector('#videoRange')
const volumeRange = document.querySelector('#volumeRange')
const currentDuration = document.querySelector('.current__duration')
const totalDuration = document.querySelector('.total__duration')
const containerElement = document.querySelector('.main-container')
const fullscreenBtn = document.querySelector('.fullscreen')


// TODO: Add some stylings
initialPage();
handlePageEvents();




//--------------------- global functionalities ------------
function initialPage() {
  // remove default controls.
  player.controls = false;
  // changing the max of range based on video duration.
  videoRange.max = Math.round(player.duration);
  // set default value for range
  videoRange.value = player.currentTime / 1000;
  volumeRange.value = player.volume * 10;
}
function handlePageEvents() {
  // Clicks
  player.addEventListener("click", togglePlay)
  playBtn.addEventListener("click", togglePlay)
  forwardBtn.addEventListener("click", () => { player.currentTime += 5 })
  backwardBtn.addEventListener("click", () => { player.currentTime -= 5 })
  fullscreenBtn.addEventListener("click", toggleFullScreen)


  // load
  player.addEventListener('canplay', calculateDuration)
  // Playing
  // Playing event call whenever video is actully playing ()
  // the "play" event only works when the player's "pause" event change to false!
  player.addEventListener('playing', () => {
    playBtn.textContent = 'Pause'
  })
  // Pause
  player.addEventListener("pause", () => {
    playBtn.textContent = "Play"
    // when video is paused
  })
  // TimeUpdate
  player.addEventListener("timeupdate", () => {
    // everytime the video current time updates
    videoRange.value = player.currentTime;
    showCurrentDuration();
  })
  // Change
  videoRange.addEventListener('change', seekVideo)
  volumeRange.addEventListener('change', changeVolume)
  // Volume Change
  player.addEventListener("volumechange", volumeHandler)


}



//--------------------- video functionalities ------------
async function togglePlay() {

  if (player.paused) {
    try {
      // play function return a promise. read this for more info : https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
      await player.play();
      videoRange.value = player.played;
    } catch (error) {
      console.log("Error while trying to play video")
    }
  } else {
    try {
      await player.pause();
    } catch (error) {
      console.log("Error while trying to play video")
    }
  }

  videoRange.max = player.duration;
}
function seekVideo() {
  player.currentTime = this.value
}
function volumeHandler(event) {
  console.log(Math.round(this.volume * 10))
  volumeRange.value = Math.round(this.volume * 10);
}
function changeVolume() {
  player.volume = (this.value * 0.1);
}
function calculateDuration() {
  totalDuration.textContent = convertSecondToMinutes(player.duration);
}
function showCurrentDuration() {
  currentDuration.textContent = convertSecondToMinutes(player.currentTime)
}
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    containerElement.requestFullscreen().catch((err) => {
      alert(
        `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`,
      );
    });
  } else {
    document.exitFullscreen();
  }
}




//--------------------- Error handeling and debugging ------------
function logElementEvents(element) {
  for (let key in element) {
    if (key.startsWith('on')) {
      console.table(key.slice(2)); // Logs the event name, without the "on" prefix
    }
  }
}


// ---------------------Utilities ---------------------
function convertSecondToMinutes(seconds) {
  const roundedSeconds = Math.round(seconds);
  const min = Math.trunc(roundedSeconds / 60).toString().padStart(2, '0');
  const sec = (roundedSeconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}