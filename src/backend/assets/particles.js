window.addEventListener("DOMContentLoaded", () => {
    particlesJS("particles-js", {
        particles: {
            number: { value: 80 },
            color: { value: "#a96bff" },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: 3 },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1,
            },
            move: { enable: true, speed: 3 },
        },
        interactivity: {
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
            },
            modes: {
                repulse: { distance: 100 },
                push: { particles_nb: 4 },
            },
        },
        retina_detect: true,
    });
});
