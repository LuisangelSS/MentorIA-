(function () {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        html.classList.add("dark");
    } else if (savedTheme === "light") {
        html.classList.remove("dark");
    } else {
        // Si no hay tema guardado, usa la preferencia del sistema
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            html.classList.add("dark");
        }
    }
})();

// Función para actualizar SVGs según el tema
function updateSVGs() {
    const isDark = document.documentElement.classList.contains('dark');
    
    // Actualizar logo principal
    const logoImg = document.querySelector('img[src*="logo.svg"]');
    if (logoImg) {
        logoImg.src = isDark ? 'assets/svg/logo.svg' : 'assets/svg/logo-dark.svg';
    }
    
    // Actualizar logo MentorIA
    const mentorLogoImg = document.querySelector('img[src*="MentorIA-logo"]');
    if (mentorLogoImg) {
        mentorLogoImg.src = isDark ? 'assets/svg/MentorIA-logo.svg' : 'assets/svg/MentorIA-logo-dark.svg';
    }
    
    // Actualizar todos los logos en el chat
    const chatLogos = document.querySelectorAll('#chat-logo img, .chat-logo img');
    chatLogos.forEach(img => {
        if (img.src.includes('logo.svg')) {
            img.src = isDark ? 'assets/svg/logo.svg' : 'assets/svg/logo-dark.svg';
        }
        if (img.src.includes('MentorIA-logo.svg')) {
            img.src = isDark ? 'assets/svg/MentorIA-logo.svg' : 'assets/svg/MentorIA-logo-dark.svg';
        }
    });
}

// Función para manejar el toggle del tema
function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const html = document.documentElement;
    
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark = html.classList.toggle("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            
            // Actualizar SVGs después del cambio de tema
            setTimeout(updateSVGs, 100);
        });
    }
}

// Inicializar cuando el DOM esté listo
function initTheme() {
    initThemeToggle();
    updateSVGs();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// Observar cambios en el DOM para actualizar SVGs dinámicamente
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            // Verificar si se agregaron nuevos elementos con logos
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const imgs = node.querySelectorAll ? node.querySelectorAll('img[src*="logo"]') : [];
                    if (node.tagName === 'IMG' && node.src && node.src.includes('logo')) {
                        updateSVGs();
                    }
                    if (imgs.length > 0) {
                        updateSVGs();
                    }
                }
            });
        }
    });
});

// Iniciar observación
observer.observe(document.body, {
    childList: true,
    subtree: true
});