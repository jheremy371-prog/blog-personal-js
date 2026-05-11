// js/auth.js

// 1. Manejar el Registro de Usuarios
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Verificar si el correo ya existe
        if (usuarios.find(u => u.email === email)) {
            return showToast('Este correo ya está registrado', 'error');
        }

        // Guardar nuevo usuario
        usuarios.push({ email, password });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        showToast('¡Registro exitoso! Redirigiendo...', 'success');
        
        // Esperar un momento para que el usuario vea el mensaje antes de redirigir
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// 2. Manejar el Inicio de Sesión
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const user = usuarios.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('sesionActiva', JSON.stringify(user));
            showToast('Bienvenido al blog', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showToast('Correo o contraseña incorrectos', 'error');
        }
    });
}

// 3. Función para cerrar sesión
function logout() {
    localStorage.removeItem('sesionActiva');
    window.location.href = 'login.html';
}