import { initAlbum } from './album.js'
import { initAdmin } from './admin.js'

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav Toggle
    const navToggle = document.getElementById('navToggle')
    const navMenu = document.getElementById('navMenu')
    const navLinks = document.querySelectorAll('.nav-link')

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active')
            navMenu.classList.toggle('active')
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : ''
        })

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active')
                navMenu.classList.remove('active')
                document.body.style.overflow = ''
            })
        })
    }

    // Header scroll background effect
    const header = document.getElementById('header')
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(245, 239, 230, 0.95)'
            header.style.boxShadow = '0 4px 20px rgba(59, 47, 47, 0.05)'
        } else {
            header.style.backgroundColor = 'rgba(245, 239, 230, 0.85)'
            header.style.boxShadow = 'none'
        }
    })

    // Initialize Modules
    initAlbum()
    initAdmin()
})
