/* ===============================
   ISKCON RAJAMPET - SCRIPT.JS
   Simple & Safe JavaScript
================================ */

/* ---------- Smooth Scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

/* ---------- Janmashtami Topic Sliders ---------- */
const janmashtamiGallery = document.querySelector('#janmashtami-gallery');
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

function openLightbox(src, altText = '') {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.88)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.cursor = 'zoom-out';
    overlay.style.zIndex = '99999';
    overlay.style.padding = '16px';
    overlay.style.backdropFilter = 'blur(4px)';

    const fullImg = document.createElement('img');
    fullImg.src = src;
    fullImg.alt = altText;
    fullImg.style.maxWidth = '94vw';
    fullImg.style.maxHeight = '88vh';
    fullImg.style.objectFit = 'contain';
    fullImg.style.borderRadius = '8px';
    fullImg.style.boxShadow = '0 10px 35px rgba(0, 0, 0, 0.7)';
    fullImg.style.transition = 'transform 0.2s ease';

    const caption = document.createElement('div');
    caption.textContent = altText || 'Tap anywhere to close';
    caption.style.color = '#fff';
    caption.style.marginTop = '10px';
    caption.style.fontSize = '0.9rem';
    caption.style.opacity = '0.85';

    overlay.appendChild(fullImg);
    overlay.appendChild(caption);
    document.body.appendChild(overlay);

    const closeHandler = () => {
        overlay.remove();
        document.removeEventListener('keydown', keyHandler);
    };

    const keyHandler = (e) => {
        if (e.key === 'Escape') closeHandler();
    };

    overlay.addEventListener('click', closeHandler);
    document.addEventListener('keydown', keyHandler);
}

if (janmashtamiGallery) {
    janmashtamiAlbums.forEach(([topic, folder, photos]) => {
        const topicSection = document.createElement('article');
        topicSection.className = 'photo-topic';
        topicSection.innerHTML = `<h3>${topic}</h3><div class="topic-slider"></div>`;

        const slider = topicSection.querySelector('.topic-slider');
        photos.forEach((photo, index) => {
            const image = document.createElement('img');
            image.src = `Sri Krishna Janmashtami 2026/${folder}/${photo}`;
            image.alt = `${topic} (${index + 1}/${photos.length})`;
            image.loading = index === 0 ? 'eager' : 'lazy';
            image.decoding = 'async';
            image.classList.toggle('active', index === 0);
            slider.appendChild(image);
        });

        // Add badge indicating number of photos
        if (photos.length > 1) {
            const badge = document.createElement('div');
            badge.className = 'slider-badge';
            badge.textContent = `1/${photos.length}`;
            slider.appendChild(badge);

            let currentPhoto = 0;
            setInterval(() => {
                const sliderPhotos = slider.querySelectorAll('img');
                sliderPhotos[currentPhoto].classList.remove('active');
                currentPhoto = (currentPhoto + 1) % sliderPhotos.length;
                sliderPhotos[currentPhoto].classList.add('active');
                badge.textContent = `${currentPhoto + 1}/${sliderPhotos.length}`;
            }, 3500);
        }

        // Tap/click slider to view active image in lightbox
        slider.addEventListener('click', () => {
            const activeImg = slider.querySelector('img.active') || slider.querySelector('img');
            if (activeImg) {
                openLightbox(activeImg.src, activeImg.alt);
            }
        });

        janmashtamiGallery.appendChild(topicSection);
    });
}

/* ---------- Gallery Image Zoom (Static Gallery) ---------- */
document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
        openLightbox(img.src, img.alt);
    });
});

/* ---------- Console Message ---------- */
console.log("ISKCON Rajampet website loaded successfully 🙏");
