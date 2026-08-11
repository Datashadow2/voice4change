// ===== CONFIGURATION =====
const TOTAL_IMAGES = 10;
const PHOTO_TRANSITION_DELAY = 3000; // 3 seconds per photo

// ===== REPLACE THESE WITH YOUR ACTUAL IMAGE PATHS =====
const imagePaths = [
    'IMG-20260810-WA0011.jpg',
    'IMG-20260810-WA0013.jpg',
    'IMG-20260810-WA0030.jpg',
    'IMG-20260810-WA0188.jpg',
    'IMG-20260810-WA0337.jpg',
    'IMG-20260810-WA0386.jpg',
    'IMG-20260810-WA0388.jpg',
    'IMG-20260810-WA0390.jpg',
    'IMG_20260811_140713_869.jpg',
    'v4c.jpg'
];

// ===== STATE =====
let loadedImages = 0;
let isMusicPlaying = false;
let currentPhotoIndex = 0;
let slideshowInterval = null;
let emojiInterval = null;
let ratingSelected = false;

// ===== DOM ELEMENTS =====
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const page4 = document.getElementById('page4');

const playBtn = document.getElementById('playBtn');
const musicStatus = document.getElementById('musicStatus');
const progressFill = document.getElementById('progressFill');
const imageCount = document.getElementById('imageCount');

const typingMessage = document.getElementById('typingMessage');
const emojiRain = document.getElementById('emojiRain');

const slideshowImage = document.getElementById('slideshowImage');
const photoCounter = document.getElementById('photoCounter');
const photoIndicators = document.getElementById('photoIndicators');
const prevPhoto = document.getElementById('prevPhoto');
const nextPhoto = document.getElementById('nextPhoto');

const ratingButtons = document.querySelectorAll('.rating-btn');
const ratingResponse = document.getElementById('ratingResponse');
const restartBtn = document.getElementById('restartBtn');

const toSlideshowBtn = document.getElementById('toSlideshowBtn');
const toRatingBtn = document.getElementById('toRatingBtn');

const bgMusic = document.getElementById('bgMusic');

// ===== PAGE NAVIGATION =====
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// ===== IMAGE LOADING =====
function loadImages() {
    imagePaths.forEach((path, index) => {
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            updateProgress();
            checkPage1Ready();
        };
        img.onerror = () => {
            // Use placeholder if image fails to load
            console.warn(`Failed to load image ${index + 1}, using placeholder`);
            loadedImages++;
            updateProgress();
            checkPage1Ready();
        };
        img.src = path;
    });
}

function updateProgress() {
    const progress = (loadedImages / TOTAL_IMAGES) * 100;
    progressFill.style.width = `${progress}%`;
    imageCount.textContent = `${loadedImages} / ${TOTAL_IMAGES}`;
}

function checkPage1Ready() {
    if (loadedImages === TOTAL_IMAGES && isMusicPlaying) {
        playBtn.disabled = true;
        playBtn.innerHTML = '<i class="fas fa-check"></i> Ready!';
        musicStatus.textContent = '✅ All loaded! Proceeding...';
        
        setTimeout(() => {
            switchPage('page2');
            startTypingEffect();
            startEmojiRain();
        }, 800);
    }
}

// ===== MUSIC CONTROLS =====
playBtn.addEventListener('click', () => {
    if (isMusicPlaying) return;
    
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-music"></i> Playing...';
        playBtn.style.background = '#006600';
        musicStatus.textContent = '🎵 Music is playing!';
        checkPage1Ready();
    }).catch(err => {
        console.error('Audio play failed:', err);
        musicStatus.textContent = '❌ Click again to play (browser may require interaction)';
    });
});

// ===== TYPING EFFECT =====
const messages = [
    '🇰🇪 For the new friends...',
    '🇰🇪 For the knowledge shared...!',
    '🇰🇪 THe food, The warmth...',
    '🇰🇪 From the bottom of our hearts',
    '🇰🇪 Thank you very much ✨'
];

function startTypingEffect() {
    let messageIndex = 0;
    let charIndex = 0;
    let currentMessage = messages[messageIndex];
    
    function typeChar() {
        if (charIndex < currentMessage.length) {
            typingMessage.textContent += currentMessage.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 80 + Math.random() * 40);
        } else {
            setTimeout(() => {
                typingMessage.textContent = '';
                charIndex = 0;
                messageIndex = (messageIndex + 1) % messages.length;
                currentMessage = messages[messageIndex];
                setTimeout(typeChar, 500);
            }, 2000);
        }
    }
    
    typeChar();
}

// ===== EMOJI RAIN =====
const emojis = ['🎉', '🌟', '💫', '✨', '🎊', '❤️', '🇰🇪', '🦁', '🌅', '🎵', '💝', '🏆'];

function startEmojiRain() {
    let count = 0;
    emojiInterval = setInterval(() => {
        const emoji = document.createElement('span');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.fontSize = (1.5 + Math.random() * 2) + 'rem';
        emoji.style.animationDuration = (4 + Math.random() * 4) + 's';
        emoji.style.animationDelay = (Math.random() * 2) + 's';
        emojiRain.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 8000);
        count++;
    }, 200);
}

// ===== SLIDESHOW =====
function initializeSlideshow() {
    // Create indicators
    photoIndicators.innerHTML = '';
    for (let i = 0; i < TOTAL_IMAGES; i++) {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => goToPhoto(i));
        photoIndicators.appendChild(dot);
    }
    
    goToPhoto(0);
    startSlideshow();
}

function goToPhoto(index) {
    currentPhotoIndex = index;
    const imgPath = imagePaths[currentPhotoIndex];
    slideshowImage.src = imgPath || 'https://via.placeholder.com/800x533/333/fff?text=Photo+Not+Found';
    
    // Update counter
    photoCounter.textContent = `${currentPhotoIndex + 1} / ${TOTAL_IMAGES}`;
    
    // Update indicators
    document.querySelectorAll('.photo-indicators span').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentPhotoIndex);
    });
    
    // Random transition effect
    const effects = ['zoom-in', 'zoom-out', 'slide-left', 'slide-right', ''];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    slideshowImage.className = 'slideshow-image';
    if (effect) {
        slideshowImage.classList.add(effect);
        setTimeout(() => {
            slideshowImage.classList.remove(effect);
        }, 600);
    }
}

function startSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        const next = (currentPhotoIndex + 1) % TOTAL_IMAGES;
        goToPhoto(next);
    }, PHOTO_TRANSITION_DELAY);
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

prevPhoto.addEventListener('click', () => {
    stopSlideshow();
    const prev = (currentPhotoIndex - 1 + TOTAL_IMAGES) % TOTAL_IMAGES;
    goToPhoto(prev);
    setTimeout(startSlideshow, 2000);
});

nextPhoto.addEventListener('click', () => {
    stopSlideshow();
    const next = (currentPhotoIndex + 1) % TOTAL_IMAGES;
    goToPhoto(next);
    setTimeout(startSlideshow, 2000);
});

// ===== RATING SYSTEM =====
const ratingMessages = {
    1: '🤔 Did you mean 1 × 1? That\'s still 1! Try again with a higher number! 😄',
    2: '😅 2 × 2 = 4, not even close! We deserve more! 🙈',
    3: '😂 3 × 3 = 9! See? You meant to give us a 9! Right? Right??',
    4: '🤨 4 × 4 = 16... Nope, that doesn\'t work. How about a 7?',
    5: '😏 5 + 5 = 10! Now that\'s more like it! Give us a 10!',
    6: '🙂 6 is the minimum acceptable. We can do better though!',
    7: '😊 7? Not bad! But we know you think we\'re at least an 8!',
    8: '🎉 8! Almost perfect! You\'re too kind!',
    9: '🌟 9! So close to perfection! Thank you!',
    10: '🎊🎉 PERFECT 10! You\'re AMAZING! 🇰🇪❤️ Thank you!'
};

const ratingStyles = {
    low: 'low',
    medium: 'medium',
    high: 'high'
};

ratingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (ratingSelected) return;
        
        const value = parseInt(btn.dataset.value);
        ratingSelected = true;
        
        // Highlight selected
        ratingButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        // Show response
        let message = ratingMessages[value] || 'Thank you for your rating!';
        let style = '';
        
        if (value <= 5) {
            style = ratingStyles.low;
        } else if (value <= 7) {
            style = ratingStyles.medium;
        } else {
            style = ratingStyles.high;
        }
        
        ratingResponse.textContent = message;
        ratingResponse.className = 'rating-response ' + style;
        
        // Show restart button
        restartBtn.style.display = 'inline-block';
        
        // Celebration for high ratings
        if (value >= 8) {
            createCelebration();
        }
    });
});

function createCelebration() {
    const emojis = ['🎉', '🎊', '⭐', '🌟', '✨', '💫', '🎆', '🎇', '🇰🇪', '❤️'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.position = 'fixed';
            el.style.left = Math.random() * 100 + '%';
            el.style.top = '-20px';
            el.style.fontSize = (2 + Math.random() * 3) + 'rem';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9999';
            el.style.animation = `fall ${2 + Math.random() * 3}s linear forwards`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 5000);
        }, i * 100);
    }
}

// ===== NAVIGATION BUTTONS =====
toSlideshowBtn.addEventListener('click', () => {
    switchPage('page3');
    initializeSlideshow();
});

toRatingBtn.addEventListener('click', () => {
    stopSlideshow();
    switchPage('page4');
});

restartBtn.addEventListener('click', () => {
    // Reset everything
    ratingSelected = false;
    ratingResponse.textContent = '';
    ratingResponse.className = 'rating-response';
    ratingButtons.forEach(b => b.classList.remove('selected'));
    restartBtn.style.display = 'none';
    switchPage('page1');
    
    // Reset music and loading
    bgMusic.pause();
    bgMusic.currentTime = 0;
    isMusicPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i> Play Music';
    playBtn.style.background = '#BB0000';
    playBtn.disabled = false;
    musicStatus.textContent = '🔇 Click play to start';
    loadedImages = 0;
    progressFill.style.width = '0%';
    imageCount.textContent = '0 / 10';
    
    // Stop emoji rain
    if (emojiInterval) {
        clearInterval(emojiInterval);
        emojiInterval = null;
    }
    emojiRain.innerHTML = '';
    typingMessage.textContent = '';
    
    // Reset slideshow
    stopSlideshow();
    currentPhotoIndex = 0;
    
    // Reload images
    loadImages();
});

// ===== KEYBOARD CONTROLS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevPhoto.click();
    } else if (e.key === 'ArrowRight') {
        nextPhoto.click();
    } else if (e.key === ' ' && page3.classList.contains('active')) {
        e.preventDefault();
        if (slideshowInterval) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    }
});

// ===== INITIALIZE =====
loadImages();
