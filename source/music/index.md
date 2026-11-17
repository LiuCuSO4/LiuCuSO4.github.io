---
title: 音乐
date: 2026-11-14 12:00:00
top_img: /img/banner.svg
comments: false
---

<div class="music-wrap">
  <div class="music-intro">
    <h2>写东西的时候，总得有点声音</h2>
    <p>下面是常听的几首，点播放就行。歌单可以在 <code>source/music/index.md</code> 里改。</p>
  </div>
  <div id="aplayer" class="music-player"></div>
  <p class="music-tip">音乐来自 SoundHelix 的示例曲，只用于演示播放器；换成自己的 mp3 直链即可。</p>
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
      { name: 'Summer', artist: '久石让', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: '/img/gallery-3.svg' },
      { name: '雨后的街道', artist: '示例音乐', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: '/img/gallery-5.svg' },
      { name: 'Night Drive', artist: '示例音乐', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cover: '/img/gallery-1.svg' }
    ]
  });
</script>
