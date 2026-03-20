document.addEventListener('DOMContentLoaded', function () {

  /* ═══════════════════════════════════════
     DROPDOWN USUARIO
  ═══════════════════════════════════════ */
  var userMenu     = document.getElementById('userMenu');
  var dropdownMenu = document.getElementById('dropdownMenu');
  var chevron      = document.getElementById('chevron');

  if (userMenu && dropdownMenu) {
    userMenu.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdownMenu.classList.toggle('open');
      if (chevron) chevron.classList.toggle('rotated', isOpen);
    });
  }

  /* ═══════════════════════════════════════
     EMPRENDEDOR — Administrar productos
  ═══════════════════════════════════════ */
  var manageBtn      = document.getElementById('manageBtn');
  var manageDropdown = document.getElementById('manageDropdown');

  if (manageBtn && manageDropdown) {
    manageBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      manageDropdown.classList.toggle('open');
    });
  }

  /* ═══════════════════════════════════════
     ADMIN — Dropdowns administrar
  ═══════════════════════════════════════ */
  function setupDropdown(btnId, dropId) {
    var btn  = document.getElementById(btnId);
    var drop = document.getElementById(dropId);
    if (!btn || !drop) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.manage-dropdown.open').forEach(function (d) {
        if (d !== drop) d.classList.remove('open');
      });
      drop.classList.toggle('open');
    });
  }
  setupDropdown('manageEmpBtn', 'manageEmpDropdown');
  setupDropdown('manageUsrBtn', 'manageUsrDropdown');

  /* Cerrar todos los dropdowns al clic fuera */
  document.addEventListener('click', function () {
    if (dropdownMenu) {
      dropdownMenu.classList.remove('open');
      if (chevron) chevron.classList.remove('rotated');
    }
    if (manageDropdown) manageDropdown.classList.remove('open');
    document.querySelectorAll('.manage-dropdown.open').forEach(function (d) {
      d.classList.remove('open');
    });
  });

  /* ═══════════════════════════════════════
     CARRUSEL
  ═══════════════════════════════════════ */
  function initCarousel(wrapperId) {
    var wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    var track     = wrapper.querySelector('.carousel-track');
    var container = wrapper.querySelector('.carousel-track-container');
    var btnPrev   = wrapper.querySelector('.carousel-btn.prev');
    var btnNext   = wrapper.querySelector('.carousel-btn.next');
    var dotsEl    = document.getElementById('dots-' + wrapperId);
    var items     = track ? Array.prototype.slice.call(
                      track.querySelectorAll('.product-card, .emp-card')
                    ) : [];

    if (!track || !container || items.length === 0) return;

    var current = 0;
    var GAP     = 16;

    function getVisible() {
      var w = window.innerWidth;
      if (w <= 480) return 1;
      if (w <= 768) return 2;
      return 3;
    }

    /* Asigna el ancho exacto a cada item según el contenedor */
    function setItemWidths() {
      var vis       = getVisible();
      var totalGap  = GAP * (vis - 1);
      var itemWidth = (container.offsetWidth - totalGap) / vis;
      items.forEach(function (item) {
        item.style.width = itemWidth + 'px';
      });
    }

    function getTotal() {
      return Math.max(1, Math.ceil(items.length / getVisible()));
    }

    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      var total = getTotal();
      for (var i = 0; i < total; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
          dot.addEventListener('click', function () { goTo(idx); });
          dotsEl.appendChild(dot);
        })(i);
      }
    }

    function goTo(index) {
      var vis      = getVisible();
      var total    = getTotal();
      current      = Math.max(0, Math.min(index, total - 1));

      var itemWidth = items[0] ? items[0].offsetWidth : 0;
      var offset    = current * vis * (itemWidth + GAP);
      track.style.transform = 'translateX(-' + offset + 'px)';

      if (dotsEl) {
        var dots = dotsEl.querySelectorAll('.carousel-dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === current);
        });
      }

      if (btnPrev) btnPrev.disabled = (current === 0);
      if (btnNext) btnNext.disabled = (current >= total - 1);
    }

    /* Botones — stopPropagation evita navegar a producto.html */
    if (btnPrev) btnPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      goTo(current - 1);
    });
    if (btnNext) btnNext.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      goTo(current + 1);
    });

    /* Clic en tarjeta de producto → navegar */
    items.forEach(function (item) {
      if (item.dataset.href) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () {
          window.location.href = item.dataset.href;
        });
      }
    });

    /* Swipe táctil */
    var startX = 0;
    container.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    container.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });

    /* Recalcular en resize */
    window.addEventListener('resize', function () {
      setItemWidths();
      buildDots();
      goTo(0);
    });

    setItemWidths();
    buildDots();
    goTo(0);
  }

  initCarousel('carousel-productos');
  initCarousel('carousel-emprendimientos');
  initCarousel('carousel-relacionados');

  /* ═══════════════════════════════════════
     CHAT
  ═══════════════════════════════════════ */
  var msgInput       = document.getElementById('msg-input');
  var sendBtn        = document.getElementById('send-btn');
  var messagesArea   = document.getElementById('messages-area');
  var chatListEl     = document.getElementById('chat-list');
  var topbarName     = document.getElementById('topbar-name');
  var topbarAvatar   = document.getElementById('topbar-avatar');
  var searchInput    = document.getElementById('search-input');
  var sidebar        = document.getElementById('chat-sidebar');
  var sidebarOpen    = document.getElementById('sidebar-open');
  var sidebarClose   = document.getElementById('sidebar-close');
  var sidebarOverlay = document.getElementById('sidebar-overlay');

  if (msgInput && sendBtn && messagesArea) {

    function getTime() {
      var now = new Date();
      return now.getHours().toString().padStart(2,'0') + ':' +
             now.getMinutes().toString().padStart(2,'0');
    }

    function scrollToBottom() { messagesArea.scrollTop = messagesArea.scrollHeight; }

    function escapeHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;')
                .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function sendMessage() {
      var text = msgInput.value.trim();
      if (!text) return;
      var row = document.createElement('div');
      row.className = 'bubble-row sent';
      row.innerHTML = '<div class="bubble-wrap"><div class="bubble">' +
                      escapeHtml(text) + '</div><div class="bubble-time">' +
                      getTime() + '</div></div>';
      messagesArea.appendChild(row);
      scrollToBottom();
      msgInput.value = '';
      msgInput.focus();
    }

    function openSidebar() {
      if (sidebar) sidebar.classList.add('open');
      if (sidebarOverlay) sidebarOverlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
      document.body.style.overflow = '';
    }

    function selectChat(item) {
      document.querySelectorAll('.chat-item').forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      if (topbarName)   topbarName.textContent        = item.dataset.name;
      if (topbarAvatar) topbarAvatar.textContent      = item.dataset.initials;
      if (topbarAvatar) topbarAvatar.style.background = item.dataset.colorBg;
      if (topbarAvatar) topbarAvatar.style.color      = item.dataset.colorText;
      closeSidebar();
    }

    sendBtn.addEventListener('click', sendMessage);
    msgInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    if (chatListEl) chatListEl.addEventListener('click', function (e) {
      var item = e.target.closest('.chat-item');
      if (item) selectChat(item);
    });
    if (sidebarOpen)    sidebarOpen.addEventListener('click', openSidebar);
    if (sidebarClose)   sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSidebar(); });
    if (searchInput) searchInput.addEventListener('input', function (e) {
      var q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.chat-item').forEach(function (item) {
        item.style.display = (
          item.dataset.name.toLowerCase().includes(q) ||
          item.dataset.preview.toLowerCase().includes(q)
        ) ? '' : 'none';
      });
    });

    scrollToBottom();
  }

  /* ═══════════════════════════════════════
     PRODUCTO — Detalle
  ═══════════════════════════════════════ */
  document.querySelectorAll('.thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      document.querySelectorAll('.thumb').forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    });
  });

  var qtyValue = document.getElementById('qtyValue');
  var qtyMinus = document.getElementById('qtyMinus');
  var qtyPlus  = document.getElementById('qtyPlus');
  if (qtyValue && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', function () {
      var v = parseInt(qtyValue.textContent);
      if (v > 1) qtyValue.textContent = v - 1;
    });
    qtyPlus.addEventListener('click', function () {
      qtyValue.textContent = parseInt(qtyValue.textContent) + 1;
    });
  }

  var btnFav = document.getElementById('btnFav');
  if (btnFav) {
    btnFav.addEventListener('click', function () {
      this.classList.toggle('active');
      this.textContent = this.classList.contains('active') ? '♥' : '♡';
    });
  }

  var starPicks  = document.querySelectorAll('.star-pick');
  var starPicker = document.querySelector('.star-picker');
  if (starPicks.length && starPicker) {
    starPicks.forEach(function (star) {
      star.addEventListener('click', function () {
        var val = parseInt(this.dataset.val);
        starPicks.forEach(function (s) {
          s.classList.toggle('active', parseInt(s.dataset.val) <= val);
          s.style.color = parseInt(s.dataset.val) <= val ? '#f5a623' : '#ddd';
        });
      });
      star.addEventListener('mouseenter', function () {
        var val = parseInt(this.dataset.val);
        starPicks.forEach(function (s) {
          s.style.color = parseInt(s.dataset.val) <= val ? '#f5a623' : '#ddd';
        });
      });
    });
    starPicker.addEventListener('mouseleave', function () {
      starPicks.forEach(function (s) {
        s.style.color = s.classList.contains('active') ? '#f5a623' : '#ddd';
      });
    });
  }

});
