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
            const imageGallery = peek.images && peek.images.length > 0 ?
                `<div class="peek-images">
                    ${peek.images.map(img => `<img src="${img}" alt="${peek.title}" class="peek-image">`).join('')}
                </div>` : '';

            return `
                <article class="peek-card">
                    ${imageGallery}
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
                        <span>Ersteller: ${peek.creator}</span>
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
