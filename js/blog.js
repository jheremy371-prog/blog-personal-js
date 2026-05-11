const blogForm = document.getElementById('blogForm');
const postsList = document.getElementById('postsList');

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Proteger la ruta: Si no hay sesión, volver al login
    const sesion = JSON.parse(localStorage.getItem('sesionActiva'));
    if (!sesion) {
        window.location.href = 'login.html';
        return;
    }
    // Mostrar el email del usuario logueado
    document.getElementById('userNameDisplay').textContent = sesion.email;
    renderPosts();
});

// Crear o Editar publicación
blogForm.addEventListener('submit', (e) => {
    e.preventDefault();
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
            date: new Date().toLocaleDateString() 
        });
    }

    localStorage.setItem('posts', JSON.stringify(posts));
    blogForm.reset();
    document.getElementById('postId').value = '';
    document.getElementById('submitBtn').textContent = 'Publicar';
    renderPosts();
});

// Leer (Renderizar) publicaciones
function renderPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    postsList.innerHTML = posts.map(post => `
        <div class="post-card">
            <h4 style="margin-bottom: 5px;">${post.title}</h4>
            <p style="color: gray; font-size: 0.8em; margin-top: 0;">${post.date} | por ${post.author}</p>
            <p>${post.content}</p>
            <button onclick="editPost(${post.id})" class="btn-edit">Editar</button>
            <button onclick="deletePost(${post.id})" class="btn-delete">Eliminar</button>
        </div>
    `).reverse().join(''); // reverse() para mostrar los más nuevos primero
}

// Eliminar publicación
function deletePost(id) {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        localStorage.setItem('posts', JSON.stringify(posts.filter(p => p.id != id)));
        renderPosts();
    }
}

// Preparar edición
function editPost(id) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(p => p.id == id);
    
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('submitBtn').textContent = 'Actualizar Publicación';
    window.scrollTo(0, 0); // Subir la vista al formulario
}