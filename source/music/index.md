<div class="music-wrap">
  <div class="music-intro">
    <h2>倾听世界</h2>
    <p>展示歌品。</p>
  </div>
  <div id="aplayer" class="music-player"></div>
</div>
<script src="/js/APlayer.min.js"></script>
<script>
var ap = new APlayer({
  container: document.getElementById('aplayer'),
  theme: '#49b1f5',
  loop: 'all',
  order: 'list',
  preload: 'none',
  volume: 0.7,
  listFolded: false,
  listMaxHeight: '260px',
  audio: [
    { name: 'Summer', artist: '久石让', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: '/img/gallery-3.svg' }
  ]
});
</script>
