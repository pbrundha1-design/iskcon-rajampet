const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

const janmashtamiAlbums = [
  ['Gopuja', 'Gopuja', ['IMG_0134.JPG', 'IMG_0136.JPG', 'IMG_0140.JPG', 'IMG_0145.JPG', 'IMG_0147.JPG', 'IMG_0151.JPG']],
  ['Kirtan', 'Kirtan', ['IMG_0168.JPG', 'IMG_0326.JPG', 'IMG_0333.JPG', 'IMG_0356.JPG', 'IMG_0378.JPG']],
  ['Maha Shankha Abhishekam', 'Maha Shankha Abhishekam', ['IMG_0165.JPG', 'IMG_0171.JPG', 'IMG_0183.JPG', 'IMG_0188.JPG', 'IMG_0203.JPG', 'IMG_0214.JPG', 'IMG_0229.JPG', 'IMG_0234.JPG', 'IMG_0246.JPG', 'IMG_0250.JPG', 'IMG_0277.JPG', 'IMG_0284.JPG', 'IMG_0291.JPG', 'IMG_0293.JPG', 'IMG_0294.JPG', 'IMG_0295.JPG']],
  ['Prasadam', 'Prasadam', ['IMG_0015.JPG', 'IMG_0021.JPG', 'IMG_0024.JPG', 'IMG_0030.JPG']],
  ['Sri Sri Radha Krishna', 'Sri Sri Radha Krishna', ['IMG_0004.JPG', 'IMG_0005.JPG', 'IMG_0063.JPG', 'IMG_0123.JPG', 'IMG_0359.JPG', 'IMG_0365.JPG', 'IMG_0368.JPG']],
  ['Srila Prabhupada Book Distribution', 'Srila Prabhupada Book Distribution', ['IMG_0034.JPG', 'IMG_0035.JPG']],
  ['Utlotsav', 'Utlotsav', ['IMG_0273.JPG']],
  ['Youth Preaching', 'Youth Preaching', ['20260904_210233.jpg', '20260904_210308.jpg', '20260904_211514.jpg.jpeg', '20260904_211540.jpg.jpeg', '20260904_212547.jpg', '20260904_212614.jpg', '20260904_212628.jpg', '20260904_212825.jpg', 'IMG_0002.JPG']]
];

function initJanmashtamiAlbums() {
  const albumsContainer = document.querySelector('[data-janmashtami-albums]');
  if (!albumsContainer) return;

  janmashtamiAlbums.forEach(([topic, folder, photos]) => {
    const album = document.createElement('article');
    album.className = 'janmashtami-album';
    album.innerHTML = `<h3>${topic}</h3><div class="janmashtami-slider"></div>`;
    const slider = album.querySelector('.janmashtami-slider');

    photos.forEach((photo, index) => {
      const image = document.createElement('img');
      image.src = `Sri Krishna Janmashtami 2026/${folder}/${photo}`;
      image.alt = `${topic} photo ${index + 1}`;
      image.classList.toggle('active', index === 0);
      slider.appendChild(image);
    });
    albumsContainer.appendChild(album);

    if (photos.length > 1) {
      let currentPhoto = 0;
      setInterval(() => {
        const sliderPhotos = slider.querySelectorAll('img');
        sliderPhotos[currentPhoto].classList.remove('active');
        currentPhoto = (currentPhoto + 1) % sliderPhotos.length;
        sliderPhotos[currentPhoto].classList.add('active');
      }, 3500);
    }
  });
}

initJanmashtamiAlbums();

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

const festivalList = document.querySelector('[data-festival-list]');
if (festivalList) {
  const calendarSource = document.querySelector('[data-calendar-source]');
  const currentMonth = new Date();
  const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' });
  const dateFormatter = new Intl.DateTimeFormat('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });

  function renderCalendarMessage(message) {
    festivalList.innerHTML = '';
    const item = document.createElement('article');
    item.className = 'festival-item reveal calendar-message';
    const title = document.createElement('h3');
    title.textContent = message;
    item.appendChild(title);
    festivalList.appendChild(item);
  }

  function renderFestivalEvents(events) {
    festivalList.innerHTML = '';
    events.forEach((festival) => {
      const item = document.createElement('article');
      item.className = 'festival-item reveal';

      const time = document.createElement('time');
      time.dateTime = festival.date;
      time.textContent = dateFormatter.format(new Date(`${festival.date}T00:00:00+05:30`));

      const title = document.createElement('h3');
      title.textContent = festival.title;

      item.append(time, title);

      if (festival.description) {
        const description = document.createElement('p');
        description.textContent = festival.description;
        item.appendChild(description);
      }

      festivalList.appendChild(item);
    });
  }

  async function loadVaishnavaCalendar() {
    renderCalendarMessage(`Loading ${monthFormatter.format(currentMonth)} updates...`);

    try {
      const response = await fetch('data/vaishnava-calendar.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Calendar data unavailable');

      const calendar = await response.json();
      const currentYear = currentMonth.getFullYear();
      const currentMonthIndex = currentMonth.getMonth();
      const monthlyEvents = (calendar.events || []).filter((event) => {
        const eventDate = new Date(`${event.date}T00:00:00+05:30`);
        return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonthIndex;
      });

      if (calendarSource && calendar.sourceUrl) {
        calendarSource.href = calendar.sourceUrl;
        calendarSource.textContent = `Open ${calendar.location || 'Vaishnava'} Calendar`;
      }

      if (monthlyEvents.length === 0) {
        renderCalendarMessage(`No Vaishnava calendar updates found for ${monthFormatter.format(currentMonth)}.`);
        return;
      }

      renderFestivalEvents(monthlyEvents);
    } catch (error) {
      console.warn(error);
      renderCalendarMessage('Vaishnava calendar updates are temporarily unavailable.');
    }
  }

  loadVaishnavaCalendar();
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

const spiritualAudio = document.getElementById('spiritual-audio');
let audioReady = false;
let userInteracted = false;
let audioStarted = false;

async function startSpiritualAudio() {
  if (!spiritualAudio || !audioReady || audioStarted) return false;

  try {
    spiritualAudio.volume = 0.45;
    spiritualAudio.muted = false;
    await spiritualAudio.play();
    audioStarted = true;
    return true;
  } catch {
    return false;
  }
}

function setupSpiritualAudio() {
  if (!spiritualAudio) return;

  const markAudioReady = () => {
    audioReady = true;
    if (userInteracted) {
      startSpiritualAudio();
      return;
    }

    startSpiritualAudio();
  };

  spiritualAudio.addEventListener('loadeddata', markAudioReady);
  spiritualAudio.addEventListener('canplay', markAudioReady);
  spiritualAudio.addEventListener('canplaythrough', markAudioReady);

  spiritualAudio.addEventListener('error', () => {
    console.warn('Spiritual audio file could not be loaded.');
  });

  const retryAudioPlayback = async () => {
    userInteracted = true;
    const started = await startSpiritualAudio();
    if (started) {
      document.removeEventListener('click', retryAudioPlayback);
      document.removeEventListener('touchstart', retryAudioPlayback);
      document.removeEventListener('keydown', retryAudioPlayback);
    }
  };

  document.addEventListener('click', retryAudioPlayback);
  document.addEventListener('touchstart', retryAudioPlayback);
  document.addEventListener('keydown', retryAudioPlayback);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startSpiritualAudio();
    }
  });

  spiritualAudio.load();
  startSpiritualAudio();
}

setupSpiritualAudio();

function openGoogleTranslateToTelugu() {
  const currentUrl = window.location.href;
  const isLocalPage = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';

  if (isLocalPage) {
    window.alert(
      'Google Translate cannot translate localhost pages directly. Open the deployed website URL and then use this Telugu translation button.'
    );
    return;
  }

  const translateUrl = `https://translate.google.com/translate?sl=auto&tl=te&u=${encodeURIComponent(currentUrl)}`;
  window.open(translateUrl, '_blank', 'noopener');
}

for (const translateButton of document.querySelectorAll('[data-translate-te]')) {
  translateButton.addEventListener('click', openGoogleTranslateToTelugu);
}
