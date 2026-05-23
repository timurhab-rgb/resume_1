(function() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.alphabet-nav a');
  const talkBtn = document.querySelector('.btn-talk');
  const homeBtns = document.querySelectorAll('.home-buttons .btn');
  let currentIndex = 0;
  let isAnimating = false;
  let scrollTimeout;

  function updateActiveNav(index) {
    navLinks.forEach((link, i) => {
      if (i === index) link.classList.add('active');
      else link.classList.remove('active');
    });
    mobileNavLinks.forEach((link, i) => {
      if (i === index) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  function applyPositions() {
    sections.forEach((sec, i) => {
      sec.classList.remove('center', 'up-1', 'up-2', 'down-1', 'down-2', 'hidden');
      if (i === currentIndex) sec.classList.add('center');
      else if (i === currentIndex - 1) sec.classList.add('up-1');
      else if (i === currentIndex - 2) sec.classList.add('up-2');
      else if (i < currentIndex - 2) sec.classList.add('hidden');
      else if (i === currentIndex + 1) sec.classList.add('down-1');
      else if (i === currentIndex + 2) sec.classList.add('down-2');
      else if (i > currentIndex + 2) sec.classList.add('hidden');
    });
  }

  function updateCarousel(newIndex) {
    if (isAnimating) return;
    if (newIndex < 0 || newIndex >= sections.length) return;
    isAnimating = true;
    currentIndex = newIndex;
    applyPositions();
    updateActiveNav(currentIndex);
    setTimeout(() => { isAnimating = false; }, 500);
  }

  window.addEventListener('wheel', (e) => {
    if (isAnimating) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (e.deltaY > 0) updateCarousel(currentIndex + 1);
      else if (e.deltaY < 0) updateCarousel(currentIndex - 1);
    }, 50);
  }, { passive: false });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
  window.addEventListener('touchend', (e) => {
    if (isAnimating) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 40) return;
    if (diff > 0) updateCarousel(currentIndex + 1);
    else updateCarousel(currentIndex - 1);
  });

  function addClickHandler(elements) {
    elements.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(el.getAttribute('data-index'));
        if (!isNaN(idx)) updateCarousel(idx);
      });
    });
  }
  addClickHandler(navLinks);
  addClickHandler(mobileNavLinks);
  if (talkBtn) addClickHandler([talkBtn]);
  addClickHandler(homeBtns);

  updateCarousel(0);

  const mobileNav = document.querySelector('.alphabet-nav');
  if (mobileNav) {
    mobileNav.addEventListener('touchstart', () => mobileNav.classList.add('expanded'));
    document.addEventListener('touchstart', (e) => {
      if (!mobileNav.contains(e.target)) mobileNav.classList.remove('expanded');
    });
  }
})();