const blogForm = document.getElementById('blogForm');
const postsList = document.getElementById('postsList');
const searchInput = document.getElementById('searchInput');

// 1. Ejecutar al cargar la página (y proteger ruta)
document.addEventListener('DOMContentLoaded', () => {
    const sesion = JSON.parse(localStorage.getItem('sesionActiva'));
    if (!sesion) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('userNameDisplay').textContent = sesion.email;
    renderPosts();
});

// 2. Buscador en tiempo real
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderPosts(e.target.value.toLowerCase());
    });
}

// 3. Crear o Editar publicación
blogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Capturar datos del formulario
    const id = document.getElementById('postId').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const user = JSON.parse(localStorage.getItem('sesionActiva')).email;

    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    if (id) {
        // Modo Edición
        const index = posts.findIndex(p => p.id == id);
        posts[index] = { ...posts[index], title, content };
    } else {
        // Modo Creación
        posts.push({ 
            id: Date.now(), 
            title, 
            content, 
            author: user, 
            date: new Date().toLocaleString() // toLocaleString añade fecha y hora
        });
    }

    // Guardar y limpiar
    localStorage.setItem('posts', JSON.stringify(posts));
    blogForm.reset();
    document.getElementById('postId').value = '';
    document.getElementById('submitBtn').textContent = 'Publicar';
    
    // Mostrar Toast
    showToast(id ? 'Publicación actualizada' : 'Publicación creada con éxito', 'success');
    
    // Limpiar buscador al crear
    if(searchInput) searchInput.value = ''; 
    renderPosts();
});

// 4. Leer (Renderizar) publicaciones con filtro
function renderPosts(filterText = '') {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    // Lógica del filtro
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(filterText) || 
        post.content.toLowerCase().includes(filterText)
    );

    // Mensaje si no hay resultados
    if (filteredPosts.length === 0) {
        postsList.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No se encontraron publicaciones.</p>`;
        return;
    }

    // Renderizar tarjetas
    postsList.innerHTML = filteredPosts.map(post => `
        <div class="post-card">
            <h4 style="margin-bottom: 5px;">${post.title}</h4>
            <p style="color: gray; font-size: 0.8em; margin-top: 0;">${post.date} | por ${post.author}</p>
            <p>${post.content}</p>
            <div style="margin-top: 15px;">
                <button onclick="editPost(${post.id})" class="btn-edit">Editar</button>
                <button onclick="deletePost(${post.id})" class="btn-delete">Eliminar</button>
            </div>
        </div>
    `).reverse().join('');
}

// 5. Eliminar publicación
function deletePost(id) {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        localStorage.setItem('posts', JSON.stringify(posts.filter(p => p.id != id)));
        
        showToast('Publicación eliminada', 'error');
        renderPosts();
    }
}

// 6. Preparar edición
function editPost(id) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(p => p.id == id);
    
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('submitBtn').textContent = 'Actualizar Publicación';
    window.scrollTo(0, 0); // Subir la vista al formulario
}