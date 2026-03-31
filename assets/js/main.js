const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

const festivals = [
  {
    date: 'March 15, 2026',
    title: 'Papamochani Ekadasi',
    description: 'Ekadasi observance with chanting, kirtan, scriptural hearing, and devotional reflection.'
  },
  {
    date: 'March 19, 2026',
    title: 'Ugadi Devotional Gathering',
    description: 'A Telugu New Year-themed satsang with prayers, prasadam, and community blessings.'
  },
  {
    date: 'March 27, 2026',
    title: 'Sri Rama Navami Celebration',
    description: 'Festival kirtan, spiritual discourse, and special seva opportunities for devotees and visitors.'
  },
  {
    date: 'March 29, 2026',
    title: 'Kamada Ekadasi',
    description: 'A focused day of japa, fasting, and evening satsang based on the Vaishnava calendar reference.'
  }
];

const festivalList = document.querySelector('[data-festival-list]');
if (festivalList) {
  festivalList.innerHTML = festivals
    .map(
      (festival) => `
        <article class="festival-item reveal">
          <time datetime="${festival.date}">${festival.date}</time>
          <h3>${festival.title}</h3>
          <p>${festival.description}</p>
        </article>
      `
    )
    .join('');
}

for (const yearNode of document.querySelectorAll('[data-year]')) {
  yearNode.textContent = new Date().getFullYear();
}

const videos = [
  { src: 'assets/videos/iskcon 1.mp4', title: 'ISKCON 1' },
  { src: 'assets/videos/iskcon 2.mp4', title: 'ISKCON 2' },
  { src: 'assets/videos/iskcon 3.mp4', title: 'ISKCON 3' },
  { src: 'assets/videos/iskcon 4.mp4', title: 'ISKCON 4' }
];

const mainVideo = document.getElementById('main-video');
const videoDotsContainer = document.querySelector('.video-dots-container');
let currentVideoIndex = 0;
let videoAdvanceTimeout = null;
let autoAdvanceInterval = null;

function setActiveDot(index) {
  const dots = document.querySelectorAll('.video-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  const videoStatus = document.getElementById('video-status');
  if (videoStatus) {
    videoStatus.textContent = `${index + 1} of ${videos.length}`;
  }
}

function playVideo(index) {
  if (!mainVideo) return;
  currentVideoIndex = index;
  mainVideo.src = videos[index].src;
  mainVideo.muted = true;
  mainVideo.playsInline = true;
  setActiveDot(index);

  clearInterval(autoAdvanceInterval);
  autoAdvanceInterval = setInterval(nextVideo, 26000); // fallback auto cycle every 26s

  mainVideo.play().catch(() => {
    const hint = document.querySelector('.video-play-hint');
    if (hint) hint.classList.add('show');
  });

  mainVideo.addEventListener('play', () => {
    const hint = document.querySelector('.video-play-hint');
    if (hint) hint.classList.remove('show');
  }, { once: true });
}

function nextVideo() {
  const nextIndex = (currentVideoIndex + 1) % videos.length;
  playVideo(nextIndex);
}

function createVideoDots() {
  if (!videoDotsContainer) return;
  videoDotsContainer.innerHTML = '';
  videos.forEach((video, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'video-dot';
    dot.setAttribute('aria-label', `Play ${video.title}`);
    dot.addEventListener('click', () => {
      clearTimeout(videoAdvanceTimeout);
      playVideo(index);
    });
    videoDotsContainer.appendChild(dot);
  });
}

function initVideoGallery() {
  if (!mainVideo || !videoDotsContainer || videos.length === 0) return;
  createVideoDots();
  playVideo(0);

  mainVideo.addEventListener('ended', () => {
    videoAdvanceTimeout = setTimeout(nextVideo, 400); // small delay before next video
  });

  autoAdvanceInterval = setInterval(nextVideo, 26000);

  // in case autoplay is blocked, allow click to start
  if (mainVideo.paused) {
    mainVideo.addEventListener('play', () => setActiveDot(currentVideoIndex));
  }
}

initVideoGallery();
