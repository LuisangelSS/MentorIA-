// Script para manejar la información del usuario en app.html
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación y cargar datos del usuario
    await loadUserInfo();
    
    // Configurar el botón de logout
    setupLogoutButton();
});

async function loadUserInfo() {
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
        // Si no hay token, redirigir al login
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/user-info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            updateUserDisplay(userData);
        } else {
            // Token inválido o expirado
            console.error('Token inválido o expirado');
            clearUserSession();
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        // En caso de error, mostrar mensaje genérico pero no redirigir inmediatamente
        document.getElementById('user-name').textContent = 'Usuario';
        document.getElementById('user-email').textContent = 'Error al cargar';
    }
}

function updateUserDisplay(userData) {
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    
    if (userNameElement && userEmailElement) {
        userNameElement.textContent = userData.username;
        userEmailElement.textContent = userData.email;
    }
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

async function handleLogout() {
    const userToken = localStorage.getItem('userToken');
    
    if (userToken) {
        try {
            // Llamar al endpoint de logout en el servidor
            await fetch('http://localhost:3000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: userToken })
            });
        } catch (error) {
            console.error('Error al hacer logout en el servidor:', error);
        }
    }
    
    // Limpiar datos locales y redirigir
    clearUserSession();
    window.location.href = 'login.html';
}

function clearUserSession() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('tokenExpiry');
}

// Función para verificar periódicamente si el token sigue siendo válido
function startTokenValidation() {
    setInterval(async () => {
        const userToken = localStorage.getItem('userToken');
        if (userToken) {
            try {
                const response = await fetch('http://localhost:3000/user-info', {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                
                if (!response.ok) {
                    // Token expirado, hacer logout automático
                    clearUserSession();
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error('Error verificando token:', error);
            }
        }
    }, 5 * 60 * 1000); // Verificar cada 5 minutos
}

// Iniciar validación periódica del token
startTokenValidation();
