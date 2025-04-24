// Importar Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCO7kQRNQUp4UObNFYBlcmtD-A7I1LiF84",
  authDomain: "otakus-sin-afecto-femenino.firebaseapp.com",
  projectId: "otakus-sin-afecto-femenino",
  storageBucket: "otakus-sin-afecto-femenino.appspot.com",
  messagingSenderId: "753689681309",
  appId: "1:753689681309:web:84a312c379d685a8952374",
  measurementId: "G-RVQF8W0ZZL"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

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

// Registrar usuario
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

    if (password.length < 7) {
        showError("La contraseña debe tener al menos 7 caracteres.", 'signup');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            usuarioActual = name;
            localStorage.setItem("usuarioActual", name);
            localStorage.setItem("usuarioEmail", email);
            alert("¡Registro exitoso!");
            container.classList.remove('right-panel-active');
        })
        .catch((error) => {
            showError("Error en el registro: " + error.message, 'signup');
        });
}

// Iniciar sesión
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

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const nombre = email.split('@')[0];
            usuarioActual = nombre;
            localStorage.setItem("usuarioActual", nombre);
            localStorage.setItem("usuarioEmail", email);
            alert("Inicio de sesión exitoso, ¡Bienvenido " + nombre + "!");
            closeForm();
            mostrarRecomendacionAleatoria();
            location.reload();
        })
        .catch((error) => {
            showError("Correo o contraseña incorrectos.", 'login');
        });

    return true;
}

// Cerrar sesión
function cerrarSesion() {
    signOut(auth).then(() => {
        alert("Sesión cerrada.");
        localStorage.removeItem("usuarioActual");
        localStorage.removeItem("usuarioEmail");
        location.reload();
    }).catch((error) => {
        alert("Error al cerrar sesión: " + error.message);
    });
}

// Cambiar de cuenta
function cambiarCuenta() {
    cerrarSesion();
    document.querySelector(".form-popup").classList.add("active-popup");
}

// Detectar cambios de sesión
onAuthStateChanged(auth, (user) => {
    if (user) {
        const name = localStorage.getItem("usuarioActual") || user.email.split("@")[0];
        actualizarAvatar(name); // <-- Asegúrate que esta función exista
    }
});

// Mostrar recomendaciones
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

// Al cargar la página
window.onload = () => {
    usuarioActual = localStorage.getItem("usuarioActual") || null;
    mostrarRecomendacionAleatoria();
    mostrarListaRecomendaciones(); // Asegúrate de tener esta función
};

// Exportar funciones globalmente
window.handleRegister = handleRegister;
window.validateLogin = validateLogin;
window.cerrarSesion = cerrarSesion;
window.cambiarCuenta = cambiarCuenta;
