import { supabase } from './supabase.js'

export function initAdmin() {
    const adminModal = document.getElementById('adminModal')
    const adminClose = document.getElementById('adminClose')
    const adminLoginView = document.getElementById('adminLoginView')
    const adminDashboardView = document.getElementById('adminDashboardView')
    const loginForm = document.getElementById('loginForm')
    const loginError = document.getElementById('loginError')
    const logoutBtn = document.getElementById('logoutBtn')
    const uploadForm = document.getElementById('uploadForm')
    const uploadProgress = document.getElementById('uploadProgress')
    const adminPhotosList = document.getElementById('adminPhotosList')

    if (!adminModal) return

    // Check hash for #admin
    const checkHash = async () => {
        if (window.location.hash === '#admin') {
            adminModal.classList.add('active')
            await checkAuth()
        }
    }

    window.addEventListener('hashchange', checkHash)
    checkHash()

    adminClose.addEventListener('click', () => {
        adminModal.classList.remove('active')
        if (window.location.hash === '#admin') {
            history.pushState('', document.title, window.location.pathname + window.location.search)
        }
    })

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            showDashboard()
        } else {
            showLogin()
        }
    }

    function showLogin() {
        adminLoginView.style.display = 'block'
        adminDashboardView.style.display = 'none'
        loginError.textContent = ''
    }

    function showDashboard() {
        adminLoginView.style.display = 'none'
        adminDashboardView.style.display = 'block'
        loadAdminPhotos()
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const email = document.getElementById('adminEmail').value
        const password = document.getElementById('adminPassword').value

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            loginError.textContent = 'Credenciales incorrectas.'
        } else {
            showDashboard()
        }
    })

    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut()
        showLogin()
    })

    // Upload & Compression
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const fileInput = document.getElementById('photoFile')
        const titleInput = document.getElementById('photoTitle')
        const uploadBtn = document.getElementById('uploadBtn')
        const file = fileInput.files[0]

        if (!file) return

        // Verify session before upload
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            alert('Sesión expirada. Por favor, inicia sesión de nuevo.')
            showLogin()
            return
        }

        uploadBtn.disabled = true
        uploadProgress.style.display = 'block'
        uploadProgress.value = 10

        try {
            // Compress image client-side
            const compressedBlob = await compressImage(file, 2000, 0.85)
            uploadProgress.value = 50

            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('photos')
                .upload(filePath, compressedBlob, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError
            uploadProgress.value = 80

            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(filePath)

            const { error: dbError } = await supabase
                .from('photos')
                .insert([{
                    title: titleInput.value.trim() || null,
                    storage_path: filePath,
                    public_url: publicUrl
                }])

            if (dbError) throw dbError

            uploadProgress.value = 100
            uploadForm.reset()
            setTimeout(() => {
                uploadProgress.style.display = 'none'
                uploadProgress.value = 0
            }, 1000)

            loadAdminPhotos()
            // Reload page album or dispatch custom event
            window.location.reload()

        } catch (err) {
            console.error('Error uploading photo:', err)
            const msg = err.message || err.toString() || 'Error desconocido'
            alert('Error al subir la fotografía: ' + msg)
        } finally {
            uploadBtn.disabled = false
        }
    })

    async function loadAdminPhotos() {
        const { data, error } = await supabase
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error loading admin photos:', error)
            return
        }

        if (!data || data.length === 0) {
            adminPhotosList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No hay fotografías.</p>'
            return
        }

        adminPhotosList.innerHTML = data.map(photo => `
            <div class="admin-photo-item">
                <div class="admin-photo-info">
                    <img src="${photo.public_url}" alt="" class="admin-photo-thumb">
                    <span class="admin-photo-title">${photo.title || 'Sin título'}</span>
                </div>
                <button class="btn-danger" data-id="${photo.id}" data-path="${photo.storage_path}">Eliminar</button>
            </div>
        `).join('')

        adminPhotosList.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('¿Estás seguro de eliminar esta fotografía?')) return
                const id = btn.getAttribute('data-id')
                const path = btn.getAttribute('data-path')

                try {
                    await supabase.storage.from('photos').remove([path])
                    await supabase.from('photos').delete().eq('id', id)
                    loadAdminPhotos()
                    window.location.reload()
                } catch (err) {
                    console.error('Error deleting photo:', err)
                    alert('Error al eliminar la fotografía.')
                }
            })
        })
    }
}

function compressImage(file, maxWidth = 2000, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
                let width = img.width
                let height = img.height

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                }

                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob failed'))
                        return
                    }
                    resolve(blob)
                }, file.type || 'image/jpeg', quality)
            }
            img.onerror = (err) => reject(err)
        }
        reader.onerror = (err) => reject(err)
    })
}
