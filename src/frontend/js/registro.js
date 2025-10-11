// Variables del modal
let termsAccepted = false;

// Funcionalidad del modal de términos y condiciones
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('termsModal');
    const openModalBtn = document.getElementById('openTermsModal');
    const closeModalBtn = document.getElementById('closeModal');
    const acceptTermsBtn = document.getElementById('acceptTerms');
    const rejectTermsBtn = document.getElementById('rejectTerms');
    const termsCheckbox = document.getElementById('terms');

    // Abrir modal al hacer clic en "términos y condiciones"
    openModalBtn.addEventListener('click', function() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    });

    // Cerrar modal con botón X
    closeModalBtn.addEventListener('click', function() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    });

    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = 'auto';
        }
    });

    // Aceptar términos
    acceptTermsBtn.addEventListener('click', function() {
        termsAccepted = true;
        termsCheckbox.checked = true;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
        showMessage('Términos y condiciones aceptados', 'success');
    });

    // Rechazar términos
    rejectTermsBtn.addEventListener('click', function() {
        termsAccepted = false;
        termsCheckbox.checked = false;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
        showMessage('Debes aceptar los términos y condiciones para continuar', 'error');
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = 'auto';
        }
    });
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            
            const formData = new FormData(e.target);
            const userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            if (!userData.username || !userData.email || !userData.password) {
                showMessage('Por favor, completa todos los campos', 'error');
                return;
            }
            
            if (userData.password.length < 6) {
                showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            // Verificar que los términos hayan sido aceptados
            if (!termsAccepted) {
                showMessage('Debes aceptar los términos y condiciones para continuar', 'error');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creando cuenta...';
            
            try {
const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();
                
if (response.ok) {
                    showMessage('¡Cuenta creada exitosamente! Redirigiendo a inicio de sesión...', 'success');
                    e.target.reset();
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);

                    // setTimeout(() => {
                    //     // Redirige a app.html
                    //     window.location.href = '../frontend/app.html';
                    //     // Alternativa más segura:
                    //     // window.location.replace('./app.html');
                    // }, 2000);

                } else {
                    showMessage(result.error || 'Error al crear la cuenta', 'error');
                }
                
            } catch (error) {
                console.error(error);
                showMessage('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Crear cuenta';
            }
        });

        function showMessage(text, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = text;
            messageDiv.className = `mb-4 p-3 rounded-lg text-center font-bold ${
                type === 'success' ? 'bg-green-600 text-text' : 'bg-red-600 text-text'
            }`;
            messageDiv.classList.remove('hidden');

            setTimeout(() => messageDiv.classList.add('hidden'), 5000);
        }