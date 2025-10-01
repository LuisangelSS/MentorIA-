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
                type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`;
            messageDiv.classList.remove('hidden');

            setTimeout(() => messageDiv.classList.add('hidden'), 5000);
        }