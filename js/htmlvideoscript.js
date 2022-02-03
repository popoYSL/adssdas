document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector("video");
    const source = video.getElementsByTagName("source")[0].src;
  
    // For more options see: https://github.com/sampotts/plyr/#options
    const defaultOptions = {};
    const controls = [
      'play-large', // The large play button in the center
      //'restart', // Restart playback
      //'rewind', // Rewind by the seek time (default 10 seconds)
      'play', // Play/pause playback
      //'fast-forward', // Fast forward by the seek time (default 10 seconds)
      'progress', // The progress bar and scrubber for playback and buffering
      'current-time', // The current time of playback
      'duration', // The full duration of the media
      'mute', // Toggle mute
      'volume', // Volume control
      'captions', // Toggle captions
      'settings', // Settings menu
      'pip', // Picture-in-picture (currently Safari only)
      'airplay', // Airplay (currently Safari only)
      // 'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
      'fullscreen' // Toggle fullscreen
  ];
  const speed = { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] };
  const settings = ['captions', 'quality', 'speed', 'loop'];
  const blankVideo = 'https://cdn.plyr.io/static/blank.mp4';
  const autoplay = true;
  const ratio = '16:9';
  const keyboard = {  focused: true, global: true  }
  const i18n =  {
    restart: '重播',
    rewind: 'Rewind {seektime}s',
    play: '播放',
    pause: '暂停',
    fastForward: 'Forward {seektime}s',
    seek: 'Seek',
    seekLabel: '{currentTime} of {duration}',
    played: 'Played',
    buffered: 'Buffered',
    currentTime: 'Current time',
    duration: 'Duration',
    volume: 'Volume',
    mute: 'Mute',
    unmute: 'Unmute',
    enableCaptions: 'Enable captions',
    disableCaptions: 'Disable captions',
    download: '下载',
    enterFullscreen: 'Enter fullscreen',
    exitFullscreen: 'Exit fullscreen',
    frameTitle: 'Player for {title}',
    captions: 'Captions',
    settings: '设置',
    pip: '旋转',
    menuBack: 'Go back to previous menu',
    speed: '播放速度',
    normal: '正常',
    quality: '画质',
    loop: '循环',
    start: '开始',
    end: '结束',
    all: '全部',
    reset: 'Reset',
    disabled: 'Disabled',
    enabled: 'Enabled',
    advertisement: 'Ad',
    qualityBadge: {
      2160: '4K',
      1440: 'HD',
      1080: 'HD',
      720: '',
      576: '',
      480: '',
    },
    };
    if (Hls.isSupported()) {
      // For more Hls.js options, see https://github.com/dailymotion/hls.js
      const hls = new Hls();
      hls.loadSource(source);
  
      // From the m3u8 playlist, hls parses the manifest and returns
      // all available video qualities. This is important, in this approach,
      // we will have one source on the Plyr player.
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        const availableQualities = hls.levels.map((l) => l.height);
        availableQualities.unshift(0); //prepend 0 to quality array
        
        
      const quality = {
          default: 0, //Default - AUTO
          options: availableQualities,
          forced: true,
          onChange: (e) => updateQuality(e)
        };
        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {

          var displayValue = document.querySelector(
            ".plyr__menu__container [data-plyr='settings']:nth-child(2) span span"
            );
          var span = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          );
          var span = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          );
          if (hls.autoLevelEnabled) {
            span.innerHTML = `自动 (${hls.levels[data.level].height}p)`;
            displayValue.innerHTML = `自动`;

          } else {
            span.innerHTML = `自动`;
            if(displayValue.innerHTML=='0p')
              displayValue.innerHTML =`自动`;
          }
        });
        var player = new Plyr(video, { controls,settings,blankVideo,autoplay,ratio,quality,i18n,speed,keyboard});
        player.on('loadeddata', (event) => {
          var loading = document.getElementById("loading");
          loading.style.display = 'none'
        });
        player.on('qualitychange', () => {
          var displayValue = document.querySelector(
            ".plyr__menu__container [data-plyr='settings']:nth-child(2) span span"
            );
            if(displayValue.innerHTML=='0p')
              displayValue.innerHTML =`自动`;
        });
      });
      hls.attachMedia(video);
      window.hls = hls;
    } else {
      // default options with no quality update in case Hls is not supported
      const player = new Plyr(video, { controls,settings,blankVideo,autoplay,ratio,i18n,speed,keyboard});
    }
    var nowQuality = ''
    function updateQuality(newQuality) {
      if (newQuality === 0) {
          window.hls.currentLevel = -1; //Enable AUTO quality if option.value = 0
          console.log("Auto quality selection");
        
      } else {
        window.hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            console.log("Found quality match with " + newQuality);
            window.hls.currentLevel = levelIndex;
          }
        });
      }
    }
  });