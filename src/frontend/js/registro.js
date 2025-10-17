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
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordHelp = document.getElementById('passwordHelp');
    const iconShow = document.getElementById('iconShow');
    const iconHide = document.getElementById('iconHide');

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

    // Toggle mostrar/ocultar contraseña
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            if (iconShow && iconHide) {
                if (isHidden) {
                    iconShow.classList.add('hidden');
                    iconHide.classList.remove('hidden');
                } else {
                    iconHide.classList.add('hidden');
                    iconShow.classList.remove('hidden');
                }
            }
        });
    }

    // Validación en vivo de la contraseña
    if (passwordInput && passwordHelp) {
        passwordInput.addEventListener('input', function() {
            const validation = validatePassword(passwordInput.value);
            if (validation.valid) {
                passwordHelp.textContent = 'Contraseña válida';
                passwordHelp.className = 'block text-xs mt-1 text-green-500';
                updatePasswordFieldStyle(true);
            } else {
                passwordHelp.textContent = validation.message;
                // Si está vacío, solo muestra el mensaje informativo sin color rojo
                if (!passwordInput.value || passwordInput.value.trim() === '') {
                    passwordHelp.className = 'block text-xs mt-1 text-gray-400';
                    updatePasswordFieldStyle(null);
                } else {
                    passwordHelp.className = 'block text-xs mt-1 text-red-500';
                    updatePasswordFieldStyle(false);
                }
            }
        });
    }
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
            
            const passwordValidation = validatePassword(userData.password);
            if (!passwordValidation.valid) {
                updatePasswordFieldStyle(false);
                showMessage(passwordValidation.message, 'error');
                return;
            } else {
                updatePasswordFieldStyle(true);
            }
            
            // Verificar que los términos hayan sido aceptados (checkbox o vía modal)
            const isTermsChecked = document.getElementById('terms') && document.getElementById('terms').checked;
            if (!(termsAccepted || isTermsChecked)) {
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

        function validatePassword(password) {
            const minLength = 6;
            const hasUpper = /[A-ZÁÉÍÓÚÑ]/;
            const hasLower = /[a-záéíóúñ]/;
            const hasNumber = /\d/;

            if (!password || password.trim() === '') {
                return { valid: false, message: 'Mínimo 6 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número.' };
            }
            if (password.length < minLength) {
                return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
            }
            if (!hasUpper.test(password)) {
                return { valid: false, message: 'Debe incluir al menos una letra mayúscula' };
            }
            if (!hasLower.test(password)) {
                return { valid: false, message: 'Debe incluir al menos una letra minúscula' };
            }
            if (!hasNumber.test(password)) {
                return { valid: false, message: 'Debe incluir al menos un número' };
            }
            return { valid: true, message: '' };
        }

        function updatePasswordFieldStyle(state) {
            // state: true (válida), false (inválida), null (neutro)
            const input = document.getElementById('password');
            if (!input) return;
            input.classList.remove('border-gray-500', 'border-red-500', 'border-green-500');
            input.classList.add('border');
            if (state === true) {
                input.classList.add('border-green-500');
            } else if (state === false) {
                input.classList.add('border-red-500');
            } else {
                input.classList.add('border-gray-500');
            }
        }