let flowers = [];
let animationPaused = false;
let weatherMode = 'sunny';

// Crear flores iniciales
function createInitialFlowers() {
    for (let i = 0; i < 8; i++) {
        addFlower();
    }
}

// Añadir una nueva flor
function addFlower() {
    const container = document.getElementById('flowers-container');
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    // Posición aleatoria
    const x = Math.random() * 80 + 10; // 10% a 90% del ancho
    const y = Math.random() * 20 + 10; // 10% a 30% desde abajo
    
    flower.style.left = x + '%';
    flower.style.bottom = y + '%';
    
    // Tamaño aleatorio
    const scale = Math.random() * 0.4 + 0.8; // 0.8 a 1.2
    flower.style.transform = `scale(${scale})`;
    
    // Crear estructura de la flor
    flower.innerHTML = `
        <div class="stem"></div>
        <div class="flower-center"></div>
        <div class="petals">
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
        </div>
        <div class="leaf"></div>
        <div class="leaf"></div>
    `;
    
    container.appendChild(flower);
    flowers.push(flower);
    
    // Efecto de aparición
    flower.style.opacity = '0';
    flower.style.transform += ' scale(0.5)';
    setTimeout(() => {
        flower.style.transition = 'all 0.8s ease-out';
        flower.style.opacity = '1';
        flower.style.transform = flower.style.transform.replace(' scale(0.5)', '');
    }, 100);
}

// Quitar la última flor
function removeFlower() {
    if (flowers.length > 0) {
        const flower = flowers.pop();
        flower.style.transition = 'all 0.5s ease-in';
        flower.style.opacity = '0';
        flower.style.transform += ' scale(0.3) rotate(180deg)';
        setTimeout(() => {
            flower.remove();
        }, 500);
    }
}

// Pausar/Reanudar animaciones
function toggleAnimation() {
    animationPaused = !animationPaused;
    const garden = document.querySelector('.garden');
    const allFlowers = document.querySelectorAll('.flower');
    
    if (animationPaused) {
        garden.style.animationPlayState = 'paused';
        allFlowers.forEach(flower => {
            flower.style.animationPlayState = 'paused';
        });
    } else {
        garden.style.animationPlayState = 'running';
        allFlowers.forEach(flower => {
            flower.style.animationPlayState = 'running';
        });
    }
}

// Cambiar clima
function changeWeather() {
    const body = document.body;
    const garden = document.querySelector('.garden');
    
    if (weatherMode === 'sunny') {
        // Modo lluvioso
        weatherMode = 'rainy';
        body.style.background = 'linear-gradient(to bottom, #4A90E2, #7FB3D3)';
        garden.style.filter = 'brightness(0.8) contrast(1.2)';
        
        // Efecto de lluvia
        createRainEffect();
    } else if (weatherMode === 'rainy') {
        // Modo atardecer
        weatherMode = 'sunset';
        body.style.background = 'linear-gradient(to bottom, #FF6B6B, #FFE66D)';
        garden.style.filter = 'brightness(1.1) saturate(1.3)';
        removeRainEffect();
    } else {
        // Volver a soleado
        weatherMode = 'sunny';
        body.style.background = 'var(--color-cielo)';
        garden.style.filter = 'none';
        removeRainEffect();
    }
}

// Crear efecto de lluvia
function createRainEffect() {
    removeRainEffect(); // Limpiar lluvia anterior
    
    const rainContainer = document.createElement('div');
    rainContainer.id = 'rain-container';
    rainContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
    `;
    
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.style.cssText = `
            position: absolute;
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, transparent, #87CEEB);
            left: ${Math.random() * 100}%;
            animation: rain ${0.5 + Math.random() * 1}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        rainContainer.appendChild(drop);
    }
    
    document.body.appendChild(rainContainer);
    
    // Añadir keyframes para la lluvia
    if (!document.querySelector('#rain-keyframes')) {
        const style = document.createElement('style');
        style.id = 'rain-keyframes';
        style.textContent = `
            @keyframes rain {
                0% { transform: translateY(-100px); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Remover efecto de lluvia
function removeRainEffect() {
    const rainContainer = document.getElementById('rain-container');
    if (rainContainer) {
        rainContainer.remove();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    createInitialFlowers();
    
    // Efectos de hover mejorados
    document.addEventListener('mousemove', function(e) {
        const flowers = document.querySelectorAll('.flower');
        flowers.forEach(flower => {
            const rect = flower.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) + 
                Math.pow(e.clientY - centerY, 2)
            );
            
            if (distance < 100) {
                flower.style.transform += ' scale(1.1)';
            } else {
                flower.style.transform = flower.style.transform.replace(' scale(1.1)', '');
            }
        });
    });
}); 