let animationPaused = false;
let isNight = false;

function setDayNightAndBanner() {
    const now = new Date();
    const hour = now.getHours();
    let message = '';
    // Día: 6 a 18, Noche: 18 a 6
    if (hour >= 6 && hour < 12) {
        isNight = false;
        message = 'Buenos días Caro';
    } else if (hour >= 12 && hour < 18) {
        isNight = false;
        message = 'Buenas tardes Caro';
    } else {
        isNight = true;
        message = 'Buenas noches Caro';
    }
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
    // Cambiar mensaje del banner
    const banner = document.querySelector('.banner');
    if (banner) {
        banner.textContent = message;
    }
}

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

// Alternar modo noche manual
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

function createBeeForSunflower(sunflower) {
    // Obtener la posición del girasol
    const container = document.querySelector('.sunflowers-container');
    const sunflowerRect = sunflower.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    // Crear la abeja
    const bee = document.createElement('div');
    bee.className = 'bee';
    // Posicionar la abeja cerca del girasol (a la derecha y un poco arriba)
    // Usar estilos left/top relativos al contenedor
    const sunflowerLeft = parseFloat(sunflower.style.left || 0);
    const sunflowerTop = parseFloat(sunflower.style.top || 0);
    bee.style.left = (sunflowerLeft + 40 + Math.random() * 10) + 'px';
    bee.style.top = (sunflowerTop - 10 + Math.random() * 10) + 'px';
    // Estructura de la abeja
    bee.innerHTML = `
        <div class="bee-body"></div>
        <div class="bee-head"></div>
        <div class="bee-wing"></div>
        <div class="bee-wing right"></div>
    `;
    container.appendChild(bee);
}

// Guardar referencias globales a las abejas y sus índices
let globalBees = [];
let globalBeeIndices = [];
let globalBeeSpeeds = [];

function createFlyingBees(numBees = 3) {
    const container = document.querySelector('.sunflowers-container');
    if (!container) return;
    if (globalBees.length === numBees && document.querySelectorAll('.bee-global').length === numBees) return;
    Array.from(document.querySelectorAll('.bee-global')).forEach(b => b.remove());
    globalBees = [];
    globalBeeIndices = [];
    globalBeeSpeeds = [];
    for (let i = 0; i < numBees; i++) {
        let bee = document.createElement('div');
        bee.className = 'bee bee-global';
        bee.innerHTML = `
            <div class="bee-body"></div>
            <div class="bee-head"></div>
            <div class="bee-wing"></div>
            <div class="bee-wing right"></div>
        `;
        container.appendChild(bee);
        globalBees.push(bee);
        // Cada abeja empieza en un girasol diferente y con velocidad diferente
        globalBeeIndices.push(i); // índice inicial diferente
        globalBeeSpeeds.push(1000 + Math.random() * 800); // velocidad aleatoria entre 1s y 1.8s
        setTimeout(() => moveBeeToNextSunflower(bee, i), i * 500);
    }
}

function moveBeeToNextSunflower(bee, idx) {
    const sunflowers = Array.from(document.querySelectorAll('.sunflower'));
    if (sunflowers.length === 0) return;
    let beeIdx = globalBeeIndices[globalBees.indexOf(bee)] || 0;
    const nextIdx = beeIdx % sunflowers.length;
    const sunflower = sunflowers[nextIdx];
    const left = parseFloat(sunflower.style.left || 0) + 40;
    const top = parseFloat(sunflower.style.top || 0) - 10;
    bee.style.transition = `left ${globalBeeSpeeds[globalBees.indexOf(bee)]}ms cubic-bezier(.68,-0.55,.27,1.55), top ${globalBeeSpeeds[globalBees.indexOf(bee)]}ms cubic-bezier(.68,-0.55,.27,1.55)`;
    bee.style.left = left + 'px';
    bee.style.top = top + 'px';
    globalBeeIndices[globalBees.indexOf(bee)] = nextIdx + 1;
    setTimeout(() => moveBeeToNextSunflower(bee, nextIdx + 1), globalBeeSpeeds[globalBees.indexOf(bee)] + 200);
}

// Modificar createSunflower para NO crear abejas individuales
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
    sunflower.style.animation = `sunflowerGrowUp 1s cubic-bezier(.68,-0.55,.27,1.55) 1, sway ${swayDuration}s ease-in-out infinite ${Math.random()}s`;
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
    setDayNightAndBanner();
    // Verificar que el contenedor existe
    const container = document.querySelector('.sunflowers-container');
    if (!container) {
        console.error('Error: No se encontró el contenedor de girasoles');
        return;
    }
    // Crear 8 girasoles aleatorios al cargar
    setTimeout(() => {
        createInitialSunflowers(8);
        setTimeout(() => createFlyingBees(3), 400);
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
        // No recrear abejas, solo dejar que sigan volando
    });
});