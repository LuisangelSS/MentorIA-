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
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
