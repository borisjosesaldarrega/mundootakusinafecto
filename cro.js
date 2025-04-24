import { initializeApp } from "firebase/app";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, updateProfile, updateEmail, updatePassword
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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

let usuarioActual = null;

// -------------------------
// Login y Registro
// -------------------------
document.getElementById('signUp').addEventListener('click', () => {
    document.getElementById('container').classList.add('right-panel-active');
});
document.getElementById('signIn').addEventListener('click', () => {
    document.getElementById('container').classList.remove('right-panel-active');
});
document.querySelector('.btnLogin-popup').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('container').style.display = 'block';
});
document.getElementById('overlay').addEventListener('click', closeForm);

function closeForm() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('container').style.display = 'none';
    clearErrors();
}

function showError(message, context = 'signup') {
    const id = context === 'signup' ? 'signup-error-message' : 'login-error-message';
    const el = document.getElementById(id);
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
    } else {
        alert(message);
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    if (password.length < 7) {
        showError("La contraseña debe tener al menos 7 caracteres.", 'signup');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => updateProfile(user, { displayName: name }))
        .then(() => {
            alert("¡Registro exitoso!");
            document.getElementById('container').classList.remove('right-panel-active');
        })
        .catch(error => showError("Error en el registro: " + error.message, 'signup'));
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

    signInWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
            usuarioActual = user.displayName || user.email.split('@')[0];
            alert("¡Bienvenido " + usuarioActual + "!");
            closeForm();
            mostrarRecomendacionAleatoria();
            location.reload();
        })
        .catch(error => showError("Correo o contraseña incorrectos.", 'login'));

    return true;
}

function cerrarSesion() {
    signOut(auth).then(() => {
        alert("Sesión cerrada.");
        location.reload();
    }).catch((error) => {
        alert("Error al cerrar sesión: " + error.message);
    });
}

function cambiarCuenta() {
    cerrarSesion();
    document.querySelector(".form-popup").classList.add("active-popup");
}

// Listener de sesión
onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioActual = user.displayName || user.email.split('@')[0];
        // Aquí podrías cargar Firestore, etc.
    } else {
        usuarioActual = null;
    }
});

// Placeholder de recomendación (migrar a Firestore después)
function mostrarRecomendacionAleatoria() {
    const p = document.getElementById("recoAleatoria");
    p.innerHTML = `
        <strong style="color: #d63384;">Boku no Pico</strong> — 
        <span style="color: #c01ef1;">Nah mentira 😏</span>, mejor ve 
        <strong style="color: #0d6efd;">Vinland Saga</strong>. Historia, acción y desarrollo brutal.
    `;
}

window.onload = () => {
    mostrarRecomendacionAleatoria();
    if (typeof mostrarListaRecomendaciones === 'function') {
        mostrarListaRecomendaciones();
    }
};

// Exportar funciones globales
window.handleRegister = handleRegister;
window.validateLogin = validateLogin;
window.cerrarSesion = cerrarSesion;
window.cambiarCuenta = cambiarCuenta;

// -------------------------
// Configuración de cuenta
// -------------------------
const settingsToggle = document.getElementById('settingsToggle');
const settingsMenu = document.getElementById('settingsMenu');

settingsToggle.addEventListener('click', () => {
    const visible = settingsMenu.style.display === 'block';
    settingsMenu.style.display = visible ? 'none' : 'block';
});

document.getElementById('editNameOption').addEventListener('click', () => {
    alert('Función para editar nombre');
});

document.getElementById('editEmailOption').addEventListener('click', () => {
    alert('Función para cambiar correo');
});

document.getElementById('editPasswordOption').addEventListener('click', () => {
    alert('Función para cambiar contraseña');
});

document.getElementById('changeAvatarOption').addEventListener('click', () => {
    document.getElementById('avatarInput').click();
});

document.getElementById('toggleDarkMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('modoOscuro', document.body.classList.contains('dark-mode') ? 'true' : 'false');
});

document.getElementById('notificationSettings').addEventListener('click', () => {
    alert('Configuración de notificaciones próximamente...');
});

document.getElementById('deleteAccountOption').addEventListener('click', () => {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmDelete) {
        const user = auth.currentUser;
        if (user) {
            user.delete().then(() => {
                alert('Cuenta eliminada.');
                cerrarSesion();
            }).catch((error) => {
                alert('Debes haber iniciado sesión recientemente para eliminar tu cuenta.');
            });
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('dark-mode');
    }
});
