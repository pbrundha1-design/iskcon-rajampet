async function renderAdminContent() {
  try {
    const [photosResponse, eventsResponse] = await Promise.all([
      fetch('/api/photos'),
      fetch('/api/events')
    ]);

    const photos = photosResponse.ok ? await photosResponse.json() : [];
    const events = eventsResponse.ok ? await eventsResponse.json() : [];

    const gallery = document.getElementById('gallery-grid');
    if (gallery) {
      if (photos.length) {
        gallery.insertAdjacentHTML('beforeend', photos
          .map((photo) => {
            const name = escapeHtml(photo.name || photo.caption || 'Temple photo');
            const caption = escapeHtml(photo.caption || '');
            return `
              <article class="photo-card reveal">
                <img src="${photo.url}" alt="${name}" />
                <h3>${name}</h3>
                <p>${caption}</p>
              </article>
            `;
          })
          .join(''));
      }
    }

    const eventsList = document.getElementById('events-list');
    if (eventsList) {
      if (events.length) {
        eventsList.innerHTML = events
          .map((event) => {
            const name = escapeHtml(event.name || 'Event');
            const date = escapeHtml(event.date || '');
            const time = escapeHtml(event.time || '');
            const place = escapeHtml(event.place || '');
            const description = escapeHtml(event.description || '');
            return `
              <article class="card reveal">
                <h3>${name}</h3>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Place:</strong> ${place}</p>
                <p>${description}</p>
              </article>
            `;
          })
          .join('');
      } else {
        eventsList.innerHTML = '<p class="muted">No events have been added yet.</p>';
      }
    }
  } catch (error) {
    console.error('Unable to load admin content', error);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', renderAdminContent);
