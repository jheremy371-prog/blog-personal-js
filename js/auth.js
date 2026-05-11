const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (usuarios.find(u => u.email === email)) return alert('El usuario ya existe');
        usuarios.push({ email, password });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Registro exitoso');
        window.location.href = 'login.html';
    });
}