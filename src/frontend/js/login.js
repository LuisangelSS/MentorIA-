document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay una sesión activa
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
        verifyTokenAndRedirect(userToken);
    }

    // Manejar el formulario de login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    if (!loginData.email || !loginData.password) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }

    if (!isValidEmail(loginData.email)) {
        showMessage('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Iniciando sesión...';
    
    try {
const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem('userToken', result.token);
            localStorage.setItem('tokenExpiry', result.expiresAt);
            window.location.href = '/app'; 

            showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            e.target.reset();
            
        } else {
            showMessage(result.error || 'Error al iniciar sesión', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar Sesión';
    }
}

async function verifyTokenAndRedirect(token) {
    try {
const response = await fetch('/user-info', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            window.location.href = '/app';
        } else {
            localStorage.removeItem('userToken');
            localStorage.removeItem('tokenExpiry');
        }
    } catch (error) {
        console.error('Error verificando token:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('tokenExpiry');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `mb-4 p-3 rounded-lg text-center font-bold ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Función para limpiar sesión (debug)
function clearSession() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('tokenExpiry');
    location.reload();
}
