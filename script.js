// Генерация звёзд с делегированием событий
const starsContainer = document.getElementById('stars');

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    starsContainer.appendChild(star);
}

for (let i = 0; i < 100; i++) createStar();

starsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const star = e.target;
        star.classList.add('explode');
        star.addEventListener('animationend', () => {
            star.remove();
            createStar();
        }, { once: true });
    }
});

// Комета
const comet = document.getElementById('comet');
const buttons = document.querySelectorAll('.btn');

function getRandomTrajectory() {
    const startX = Math.random() * 120 - 10;
    const startY = Math.random() * 120 - 10;
    const endX = -20 - Math.random() * 50;
    const endY = 120 + Math.random() * 50;
    return {
        startX: `${startX}%`,
        startY: `${startY}%`,
        endX: `${endX}%`,
        endY: `${endY}%`,
        duration: 3 + Math.random() * 4
    };
}

function launchComet() {
    const { startX, startY, endX, endY, duration } = getRandomTrajectory();
    
    comet.style.left = startX;
    comet.style.top = startY;
    comet.style.transition = 'none';
    comet.classList.remove('explode');
    
    requestAnimationFrame(() => {
        comet.style.transition = `left ${duration}s linear, top ${duration}s ease-in`;
        comet.style.left = endX;
        comet.style.top = endY;
    });
    
    comet.addEventListener('transitionend', () => {
        checkCollision();
        launchComet();
    }, { once: true });
}

function checkCollision() {
    const cometRect = comet.getBoundingClientRect();
    
    buttons.forEach(btn => {
        const btnRect = btn.getBoundingClientRect();
        
        if (
            cometRect.right > btnRect.left &&
            cometRect.left < btnRect.right &&
            cometRect.bottom > btnRect.top &&
            cometRect.top < btnRect.bottom
        ) {
            btn.classList.add('shake');
            explodeComet(cometRect.left, cometRect.top);
            
            btn.addEventListener('animationend', () => {
                btn.classList.remove('shake');
            }, { once: true });
        }
    });
}

function explodeComet(x, y) {
    comet.classList.add('explode');
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'comet-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--tx', `${Math.random() * 100 - 50}px`);
        particle.style.setProperty('--ty', `${Math.random() * 100 - 50}px`);
        document.body.appendChild(particle);
        
        particle.addEventListener('animationend', () => {
            particle.remove();
        }, { once: true });
    }
}

// Переключение текста
const title = document.getElementById('title');
const buttonsContainer = document.getElementById('buttons');
const description = document.getElementById('description');
const typedText = document.getElementById('typed-text');
const textToType = "Здоровеньки! Все просто, все інше, все більше. сплячіСиндроми.";
let isToggled = false;

function typeText(text, element, callback) {
    let index = 0;
    element.textContent = '';
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 50);
}

title.addEventListener('click', () => {
    if (!isToggled) {
        buttonsContainer.classList.add('hidden');
        setTimeout(() => {
            buttonsContainer.style.display = 'none';
            description.style.display = 'block';
            description.classList.add('active');
            typeText(textToType, typedText);
        }, 500);
    } else {
        description.classList.remove('active');
        typedText.textContent = '';
        setTimeout(() => {
            description.style.display = 'none';
            buttonsContainer.style.display = 'block';
            buttonsContainer.classList.remove('hidden');
        }, 500);
    }
    isToggled = !isToggled;
});

// UFO анимация (исправленная версия)
const ufo = document.getElementById('ufo');
const ufoLaser = document.getElementById('ufo-laser');
let isUfoActive = false;

function startUfoAttack() {
    if (isUfoActive) return;
    isUfoActive = true;

    // Сброс предыдущих анимаций
    title.style.animation = 'none';
    void title.offsetWidth; // Триггер рефлоу
    title.style.animation = 'fadeIn 1s ease-out forwards';

    ufo.style.animation = 'none';
    ufoLaser.style.animation = 'none';
    void ufo.offsetWidth;
    void ufoLaser.offsetWidth;

    // Запуск новых анимаций
    ufo.style.animation = 'ufoFly 4s ease-in-out forwards';
    ufoLaser.style.animation = 'laserBeam 2s 1s ease-in-out forwards';

    setTimeout(() => {
        title.style.animation = 'textAbduct 1.5s ease-in forwards';
    }, 2500);

    setTimeout(() => {
        title.style.animation = 'fadeIn 1s ease-out forwards';
        isUfoActive = false;
    }, 4000);

    // Следующая атака через 30-60 секунд
    setTimeout(startUfoAttack, 30000 + Math.random() * 30000);
}

// Запуск кометы и НЛО
window.addEventListener('load', () => {
    launchComet();
    setTimeout(startUfoAttack, 10000);
});