let animationPaused = false;
let isNight = false;

// Pausar/Reanudar animaciones
function toggleAnimation() {
    animationPaused = !animationPaused;
    const elements = document.querySelectorAll('.cloud, .sun, .sunflower');
    elements.forEach(element => {
        if (animationPaused) {
            element.classList.add('paused');
        } else {
            element.classList.remove('paused');
        }
    });
}

// Alternar modo noche
function toggleNightMode() {
    isNight = !isNight;
    document.body.classList.toggle('night', isNight);
    // Cambiar texto del botón
    const btn = document.getElementById('nightModeBtn');
    if (btn) {
        btn.innerHTML = isNight ? '☀️ Día' : '🌙 Noche';
    }
    // Generar estrellas si es noche
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        starsContainer.innerHTML = '';
        if (isNight) {
            createStars(80, starsContainer);
        }
    }
}

// Crear estrellas aleatorias en el cielo
function createStars(count, container) {
    if (!container) return;
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight * 0.5;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * width + 'px';
        star.style.top = Math.random() * height + 'px';
        star.style.opacity = 0.5 + Math.random() * 0.5;
        star.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        container.appendChild(star);
    }
}

// Crear girasol dinámicamente SOLO en la parte verde
function createSunflower(x, y, forceToField = false) {
    const container = document.querySelector('.sunflowers-container');
    if (!container) {
        console.error('Contenedor de girasoles no encontrado');
        return;
    }
    const sunflower = document.createElement('div');
    sunflower.className = 'sunflower';

    // Limitar a la parte verde (campo)
    const fieldTop = container.offsetHeight / 2; // 50% desde arriba
    if (y < fieldTop || forceToField) {
        y = fieldTop + (container.offsetHeight / 2) * 0.8 * Math.random();
    }

    // Posicionar el girasol usando left/top relativos al contenedor
    sunflower.style.left = `${x - 30}px`;
    sunflower.style.top = `${y - 60}px`;

    // Añadir tallo y hoja
    const stem = document.createElement('div');
    stem.className = 'stem';
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    sunflower.appendChild(stem);
    sunflower.appendChild(leaf);

    // Animación de balanceo aleatoria
    const swayDuration = 3 + Math.random() * 2;
    sunflower.style.animation = `growSunflower 0.7s cubic-bezier(.68,-0.55,.27,1.55) 1, sway ${swayDuration}s ease-in-out infinite ${Math.random()}s`;

    container.appendChild(sunflower);
}

// Crear girasoles aleatorios SOLO en la parte verde al cargar
function createInitialSunflowers(count = 8) {
    const container = document.querySelector('.sunflowers-container');
    if (!container) {
        console.error('Contenedor de girasoles no encontrado');
        return;
    }
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
        // Márgenes para que no salgan cortados
        const marginX = 40;
        const marginY = 80;
        const x = Math.random() * (rect.width - marginX * 2) + marginX;
        // Solo en la parte verde:
        const fieldTop = rect.height / 2;
        const y = fieldTop + Math.random() * (rect.height / 2 - marginY);
        createSunflower(x, y);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que el contenedor existe
    const container = document.querySelector('.sunflowers-container');
    if (!container) {
        console.error('Error: No se encontró el contenedor de girasoles');
        return;
    }
    // Crear 8 girasoles aleatorios al cargar
    setTimeout(() => {
        createInitialSunflowers(8);
    }, 200);

    // Permitir crear girasoles al hacer clic en el paisaje
    const landscape = document.body;
    landscape.addEventListener('click', function(e) {
        // Evitar crear girasol si se hace clic en controles o info
        if (e.target.closest('.controls') || e.target.closest('.info')) return;
        // Obtener posición relativa al viewport
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Si el clic es en el cielo, forzar a la parte verde
        const fieldTop = container.offsetHeight / 2;
        if (y < fieldTop) {
            createSunflower(x, y, true);
        } else {
            createSunflower(x, y);
        }
    });
});