/* ============================================================
   自定义脚本：相册灯箱（不依赖任何第三方库）
   ============================================================ */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.photo-item img'));
    if (!items.length) return;

    var index = 0;
    var box = null;

    function captionOf(img) {
      var fig = img.closest('figure');
      if (!fig) return '';
      var span = fig.querySelector('figcaption span');
      var small = fig.querySelector('figcaption small');
      var parts = [];
      if (span) parts.push(span.textContent);
      if (small) parts.push(small.textContent);
      return parts.join(' · ');
    }

    function show(i) {
      index = (i + items.length) % items.length;
      var img = box.querySelector('img');
      img.src = items[index].currentSrc || items[index].src;
      img.alt = items[index].alt || '';
      box.querySelector('.my-lightbox-cap').textContent = captionOf(items[index]);
    }

    function close() {
      if (!box) return;
      box.classList.remove('show');
      var node = box;
      box = null;
      document.body.style.overflow = '';
      setTimeout(function () { node.remove(); }, 220);
    }

    function open(i) {
      if (box) return;
      box = document.createElement('div');
      box.className = 'my-lightbox';
      box.innerHTML =
        '<button class="my-lb-btn my-lb-close" aria-label="关闭">✕</button>' +
        '<button class="my-lb-btn my-lb-prev" aria-label="上一张">‹</button>' +
        '<img alt="">' +
        '<button class="my-lb-btn my-lb-next" aria-label="下一张">›</button>' +
        '<div class="my-lightbox-cap"></div>';

      box.addEventListener('click', function (e) {
        if (e.target === box) close();
        if (e.target.classList.contains('my-lb-close')) close();
        if (e.target.classList.contains('my-lb-prev')) show(index - 1);
        if (e.target.classList.contains('my-lb-next')) show(index + 1);
      });

      document.body.appendChild(box);
      document.body.style.overflow = 'hidden';
      show(i);
      requestAnimationFrame(function () { box.classList.add('show'); });
    }

    items.forEach(function (img, i) {
      img.addEventListener('click', function () { open(i); });
      var fig = img.closest('figure');
      if (fig) fig.setAttribute('tabindex', '0');
      if (fig) {
        fig.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open(i);
          }
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!box) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  });
})();
