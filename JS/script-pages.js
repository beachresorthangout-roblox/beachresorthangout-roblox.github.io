document.addEventListener('DOMContentLoaded', () => {
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.closest('.faq-item');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!isExpanded));
            faqItem.classList.toggle('open');
        });
    });

    if (document.getElementById('peekList')) {
        loadSneakPeeks();
    }

    if (document.getElementById('devlogList')) {
        loadDevLog();
    }
});

async function loadSneakPeeks() {
    try {
        const response = await fetch('JSON-Datastores/sneak-peeks.json');
        const peekData = await response.json();

        // Sort by date (newest first)
        peekData.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

        const peekList = document.getElementById('peekList');

        if (!peekList) return;

        peekList.innerHTML = peekData.map(peek => {
            const mediaItems = peek.media ?? peek.images ?? [];
            const mediaGallery = mediaItems && mediaItems.length > 0 ?
                `<div class="peek-images">
                    ${mediaItems.map(item => renderPeekMedia(item, peek.title)).join('')}
                </div>` : '';

            return `
                <article class="peek-card">
                    ${mediaGallery}
                    <div class="peek-head">
                        <div>
                            <span class="peek-tag">Sneak Peek</span>
                            <h3>${peek.title}</h3>
                        </div>
                        <span class="peek-version">${peek.version}</span>
                    </div>
                    <p class="peek-summary">${peek.summary}</p>
                    <div class="peek-meta">
                        <span>${formatDate(peek.date)} • ${peek.time}</span>
                        <span>Creator: ${peek.creator}</span>
                    </div>
                </article>
            `;
        }).join('');
    } catch (error) {
        console.error('Sneak Peeks JSON konnte nicht geladen werden:', error);
    }
}

async function loadDevLog() {
    try {
        const response = await fetch('JSON-Datastores/devlog.json');
        const devlogData = await response.json();

        // Sort by date (newest first)
        devlogData.sort((a, b) => new Date(b.date) - new Date(a.date));

        const devlogList = document.getElementById('devlogList');

        if (!devlogList) return;

        devlogList.innerHTML = devlogData.map(entry => `
            <article class="devlog-card">
                <div class="devlog-head">
                    <div>
                        <h3>${entry.title}</h3>
                        <span class="devlog-tag">${entry.tag}</span>
                    </div>
                    <span class="devlog-date">${formatDate(entry.date)}</span>
                </div>
                <p>${entry.details}</p>
            </article>
        `).join('');
    } catch (error) {
        console.error('Dev Log JSON konnte nicht geladen werden:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function renderPeekMedia(item, title) {
    if (typeof item === 'string') {
        if (isVideoSrc(item)) {
            return renderVideoItem(item);
        }
        return `<a href="${item}" target="_blank" rel="noopener noreferrer"><img src="${item}" alt="${title}" class="peek-image"></a>`;
    }

    if (item && item.type === 'video' && item.src) {
        return renderVideoItem(item.src, item.poster);
    }

    if (item && item.src) {
        return `<a href="${item.src}" target="_blank" rel="noopener noreferrer"><img src="${item.src}" alt="${item.alt || title}" class="peek-image"></a>`;
    }

    return '';
}

function renderVideoItem(src, poster) {
    return `<video class="peek-video" controls preload="metadata"${poster ? ` poster="${poster}"` : ''}>
                <source src="${src}" type="${getVideoMimeType(src)}">
                Dein Browser unterstützt kein HTML5-Video.
            </video>`;
}

function isVideoSrc(src) {
    return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src);
}

function getVideoMimeType(src) {
    if (/\.mp4(\?.*)?$/i.test(src)) return 'video/mp4';
    if (/\.webm(\?.*)?$/i.test(src)) return 'video/webm';
    if (/\.ogg(\?.*)?$/i.test(src)) return 'video/ogg';
    if (/\.mov(\?.*)?$/i.test(src)) return 'video/quicktime';
    if (/\.m4v(\?.*)?$/i.test(src)) return 'video/x-m4v';
    return 'video/mp4';
}
