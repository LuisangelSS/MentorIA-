// Script para manejar la página de perfil
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
        window.location.href = '/login';
        return;
    }

    // Cargar información del usuario
    await loadUserInfo();

    // Configurar manejador del formulario único
    setupFormHandler();
});

async function loadUserInfo() {
    const userToken = localStorage.getItem('userToken');
    
    try {
const response = await fetch('/user-info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            document.getElementById('current-username').textContent = userData.username;
            document.getElementById('current-email').textContent = userData.email;
        } else {
            showMessage('Error al cargar la información del usuario', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión', 'error');
    }
}

function setupFormHandler() {
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const newUsername = formData.get('newUsername')?.trim();
        const newEmail = formData.get('newEmail')?.trim().toLowerCase();
        const currentPassword = formData.get('currentPassword')?.trim();
        const newPassword = formData.get('newPassword')?.trim();
        const confirmPassword = formData.get('confirmPassword')?.trim();
        
        // Validaciones del cliente
        const validationResult = validateFormData({
            newUsername,
            newEmail,
            currentPassword,
            newPassword,
            confirmPassword
        });
        
        if (!validationResult.isValid) {
            showMessage(validationResult.message, 'error');
            return;
        }
        
        // Procesar actualización
        await updateProfile({
            newUsername: newUsername || undefined,
            newEmail: newEmail || undefined,
            currentPassword: currentPassword || undefined,
            newPassword: newPassword || undefined
        });
    });
}

function validateFormData({ newUsername, newEmail, currentPassword, newPassword, confirmPassword }) {
    // Verificar si hay algo que actualizar
    const hasUsername = newUsername && newUsername.length > 0;
    const hasEmail = newEmail && newEmail.length > 0;
    const hasPassword = newPassword && newPassword.length > 0;
    
    if (!hasUsername && !hasEmail && !hasPassword) {
        return {
            isValid: false,
            message: 'Debe cambiar al menos un campo para guardar'
        };
    }
    
    // Validar username
    if (hasUsername && newUsername.length < 3) {
        return {
            isValid: false,
            message: 'El nombre de usuario debe tener al menos 3 caracteres'
        };
    }
    
    // Validar email
    if (hasEmail && !isValidEmail(newEmail)) {
        return {
            isValid: false,
            message: 'El formato del email no es válido'
        };
    }
    
    // Validar contraseña
    if (hasPassword) {
        if (!currentPassword) {
            return {
                isValid: false,
                message: 'Debe ingresar su contraseña actual para cambiarla'
            };
        }
        
        if (newPassword.length < 6) {
            return {
                isValid: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres'
            };
        }
        
        if (newPassword !== confirmPassword) {
            return {
                isValid: false,
                message: 'Las contraseñas no coinciden'
            };
        }
    }
    
    return { isValid: true };
}

async function updateProfile(profileData) {
    const userToken = localStorage.getItem('userToken');
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.innerHTML;
    
    // Deshabilitar el botón y mostrar estado de carga
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="bx bx-loader-alt animate-spin mr-2"></i>Guardando...';
    
    try {
const response = await fetch('/profile/update-all', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            
            // Mostrar mensaje de éxito por más tiempo
            setTimeout(() => {
                // Limpiar sesión actual
                localStorage.removeItem('userToken');
                localStorage.removeItem('tokenExpiry');
                
                // Redirigir al login
                window.location.href = '/login';
            }, 3000); // 3 segundos para que el usuario lea el mensaje
            
        } else {
            showMessage(result.error || 'Error al actualizar el perfil', 'error');
            // Rehabilitar el botón si hay error
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Intente nuevamente.', 'error');
        // Rehabilitar el botón si hay error
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
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
        type === 'success' 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border border-green-400' 
            : 'bg-gradient-to-r from-red-600 to-pink-600 text-white border border-red-400'
    }`;
    messageDiv.classList.remove('hidden');
    
    // Scroll hacia arriba para ver el mensaje
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Para mensajes de éxito, mantener visible más tiempo
    const timeout = type === 'success' ? 8000 : 5000;
    setTimeout(() => {
        if (type !== 'success' || !document.getElementById('saveBtn').disabled) {
            messageDiv.classList.add('hidden');
        }
    }, timeout);
}
