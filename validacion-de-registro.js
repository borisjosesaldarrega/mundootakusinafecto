// Variables globales
let usuarioActual = null;

// -------------------------
// Login y Registro
// -------------------------
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const overlay = document.getElementById('overlay');
const btnPopup = document.querySelector('.btnLogin-popup');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});
signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

btnPopup.addEventListener('click', () => {
    overlay.style.display = 'block';
    container.style.display = 'block';
});
overlay.addEventListener('click', closeForm);

function closeForm() {
    overlay.style.display = 'none';
    container.style.display = 'none';
    clearErrors();
}

function showError(message, context = 'signup') {
    const id = context === 'signup' ? 'signup-error-message' : 'login-error-message';
    const errorMessage = document.getElementById(id);
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    } else {
        alert(message);
    }
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function handleRegister() {
    clearErrors();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!name || !email || !password) {
        showError("Todos los campos son obligatorios.", 'signup');
        return;
    }

    if (!validateEmail(email)) {
        showError("Correo electrónico no válido.", 'signup');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        showError("Este correo ya está registrado.", 'signup');
        return;
    }

    if (users.some(user => user.name.toLowerCase() === name.toLowerCase())) {
        showError("Este nombre ya está en uso.", 'signup');
        return;
    }

    if (password.length < 7) {
        showError("La contraseña debe tener al menos 7 caracteres.", 'signup');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert("¡Registro exitoso!");
    container.classList.remove('right-panel-active');
}

function validateLogin() {
    clearErrors();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        showError("Todos los campos son obligatorios.", 'login');
        return false;
    }

    if (!validateEmail(email)) {
        showError("Correo electrónico no válido.", 'login');
        return false;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);

    if (!user) {
        showError("Correo no registrado.", 'login');
        return false;
    }

    if (user.password !== password) {
        showError("Contraseña incorrecta.", 'login');
        return false;
    }

    usuarioActual = user.name;
    localStorage.setItem("usuarioActual", usuarioActual); // guardar sesión
    alert("Inicio de sesión exitoso, ¡Bienvenido " + usuarioActual + "!");
    closeForm();
    mostrarRecomendacionAleatoria();
    location.reload();
    return true;
}

document.getElementById('lila').addEventListener('click', (e) => {
    e.preventDefault();
    handleRegister();
});

document.getElementById('login-btn').addEventListener('click', (e) => {
    e.preventDefault();
    validateLogin();
});

// -------------------------
// Recomendaciones
// -------------------------
function mostrarRecomendacion() {
    if (!usuarioActual) {
        alert("Debes iniciar sesión para recomendar un anime.");
        return;
    }
    document.getElementById("modalRecomendacion").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modalRecomendacion").style.display = "none";
}

function guardarRecomendacion() {
    const input = document.getElementById("inputRecomendacion").value.trim();
    if (input && usuarioActual) {
        let recomendaciones = JSON.parse(localStorage.getItem("recomendacionesAnime")) || [];
        recomendaciones.push({ usuario: usuarioActual, anime: input });
        localStorage.setItem("recomendacionesAnime", JSON.stringify(recomendaciones));
        document.getElementById("inputRecomendacion").value = "";
        mostrarRecomendacionAleatoria();
        mostrarListaRecomendaciones(); // Actualizamos la lista de recomendaciones
        cerrarModal();
    }
}

function mostrarRecomendacionAleatoria() {
    const p = document.getElementById("recoAleatoria");
    const recomendaciones = JSON.parse(localStorage.getItem("recomendacionesAnime")) || [];

    if (recomendaciones.length > 0) {
        const aleatoria = recomendaciones[Math.floor(Math.random() * recomendaciones.length)];
        p.innerHTML = `<strong style="color: #0d6efd;">${aleatoria.usuario}</strong> recomienda: <strong style="color: #6610f2;">${aleatoria.anime}</strong>`;
    } else {
        p.innerHTML = `
            <strong style="color: #d63384;">Boku no Pico</strong> — <span style="color: #c01ef1;">Nah mentira 😏</span>, mejor ve 
            <strong style="color: #0d6efd;">Vinland Saga</strong>. Historia, acción y desarrollo brutal.
        `;
    }
}

function mostrarRecomendacion() {
    if (!usuarioActual) {
        alert("Debes iniciar sesión para recomendar un anime.");
        return;
    }
    document.getElementById("modalRecomendacion").style.display = "block";
    document.getElementById("listaRecomendaciones").style.display = "none"; // Oculta lista
}

function cerrarModal() {
    document.getElementById("modalRecomendacion").style.display = "none";
    document.getElementById("listaRecomendaciones").style.display = "block"; // Muestra lista
}

// Este bloque va en el otro archivo JS (hamburguesa.js)
window.addEventListener("DOMContentLoaded", () => {
    const userNameEl = document.getElementById("userName");
    const userEmailEl = document.getElementById("userEmail");
    const avatarEl = document.getElementById("userAvatar");
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const actual = localStorage.getItem("usuarioActual");
  
    if (actual) {
      const user = users.find(u => u.name === actual);
      if (user) {
        userNameEl.textContent = user.name;
        userEmailEl.textContent = user.email;
        avatarEl.textContent = user.name[0].toUpperCase();
  
        document.getElementById("loginOption").style.display = "none";
        document.getElementById("changeAccount").style.display = "block";
        document.getElementById("logoutOption").style.display = "block";
      }
    } else {
      userNameEl.textContent = "Invitado";
      userEmailEl.textContent = "No has iniciado sesión";
      avatarEl.textContent = "?";
  
      document.getElementById("loginOption").style.display = "block";
      document.getElementById("changeAccount").style.display = "none";
      document.getElementById("logoutOption").style.display = "none";
    }
  });
  


// Al cargar la página
window.onload = () => {
    usuarioActual = localStorage.getItem("usuarioActual") || null;
    mostrarRecomendacionAleatoria();
    mostrarListaRecomendaciones(); // Mostramos la lista de recomendaciones al cargar la página
};
