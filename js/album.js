import { supabase } from './supabase.js'

let photos = []
let currentIndex = 0

export async function initAlbum() {
    const grid = document.getElementById('albumGrid')
    if (!grid) return

    try {
        const { data, error } = await supabase
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        photos = data || []

        if (photos.length === 0) {
            grid.innerHTML = '<div class="album-loading">No hay fotografías publicadas aún.</div>'
            return
        }

        renderGrid(grid)
        initHeroBackground(photos[0].public_url)
        initLightbox()

    } catch (err) {
        console.error('Error fetching photos:', err)
        grid.innerHTML = '<div class="album-loading">Error al cargar las fotografías.</div>'
    }
}

function renderGrid(container) {
    container.innerHTML = photos.map((photo, index) => `
        <div class="album-item" data-index="${index}">
            <img src="${photo.public_url}" alt="${photo.title || 'Fotografía de paisaje'}" loading="lazy">
        </div>
    `).join('')

    container.querySelectorAll('.album-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'), 10)
            openLightbox(index)
        })
    })
}

function initHeroBackground(url) {
    const heroBg = document.getElementById('heroBg')
    const hero = document.getElementById('hero')
    if (heroBg && url) {
        heroBg.style.backgroundImage = `url('${url}')`
        setTimeout(() => {
            hero.classList.add('loaded')
        }, 100)
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox')
    const lightboxImg = document.getElementById('lightboxImg')
    const closeBtn = document.getElementById('lightboxClose')
    const prevBtn = document.getElementById('lightboxPrev')
    const nextBtn = document.getElementById('lightboxNext')

    if (!lightbox) return

    window.openLightbox = (index) => {
        currentIndex = index
        lightboxImg.src = photos[currentIndex].public_url
        lightbox.classList.add('active')
        document.body.style.overflow = 'hidden'
    }

    const closeLightbox = () => {
        lightbox.classList.remove('active')
        document.body.style.overflow = ''
    }

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length
        lightboxImg.src = photos[currentIndex].public_url
    }

    const showNext = () => {
        currentIndex = (currentIndex + 1) % photos.length
        lightboxImg.src = photos[currentIndex].public_url
    }

    closeBtn.addEventListener('click', closeLightbox)
    prevBtn.addEventListener('click', showPrev)
    nextBtn.addEventListener('click', showNext)

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox()
    })

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return
        if (e.key === 'Escape') closeLightbox()
        if (e.key === 'ArrowLeft') showPrev()
        if (e.key === 'ArrowRight') showNext()
    })
}
