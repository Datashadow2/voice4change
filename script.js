// ===== CONFIGURATION =====
const TOTAL_IMAGES = 10;
const MIN_PHOTO_DELAY = 5000; // 5 seconds minimum
const MAX_PHOTO_DELAY = 7000; // 7 seconds maximum

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
let isTypingComplete = false;
let typingTimeout = null;
let photosViewed = 0;
let isSlideshowComplete = false;

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

// ===== SET MUSIC SOURCE =====
bgMusic.src = 'NF%2C_Sasha_Sloan_-_Only__Audio_(48k).m4a';
bgMusic.load();

// ===== PAGE NAVIGATION =====
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// ===== IMAGE LOADING =====
function loadImages() {
    loadedImages = 0;
    imagePaths.forEach((path, index) => {
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            updateProgress();
            checkPage1Ready();
        };
        img.onerror = () => {
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
    '🇰🇪 For the knowledge shared...',
    '🇰🇪 The food, The warmth...',
    '🇰🇪 From the bottom of our hearts',
    '🇰🇪 Thank you very much ✨'
];

function startTypingEffect() {
    isTypingComplete = false;
    toSlideshowBtn.style.display = 'none';
    
    let messageIndex = 0;
    let charIndex = 0;
    let currentMessage = messages[messageIndex];
    
    // Clear any existing timeout
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    
    // Clear existing text
    typingMessage.textContent = '';
    
    function typeChar() {
        if (charIndex < currentMessage.length) {
            typingMessage.textContent += currentMessage.charAt(charIndex);
            charIndex++;
            typingTimeout = setTimeout(typeChar, 80 + Math.random() * 40);
        } else {
            if (messageIndex === messages.length - 1) {
                isTypingComplete = true;
                toSlideshowBtn.style.display = 'inline-block';
                toSlideshowBtn.style.animation = 'pulse 1s infinite';
            } else {
                setTimeout(() => {
                    typingMessage.textContent = '';
                    charIndex = 0;
                    messageIndex++;
                    currentMessage = messages[messageIndex];
                    typingTimeout = setTimeout(typeChar, 500);
                }, 1500);
            }
        }
    }
    
    typeChar();
}

// ===== EMOJI RAIN =====
const emojis = ['🎉', '🌟', '💫', '✨', '🎊', '❤️', '🇰🇪', '🦁', '🌅', '🎵', '💝', '🏆'];

function startEmojiRain() {
    // Clear existing emojis
    emojiRain.innerHTML = '';
    if (emojiInterval) {
        clearInterval(emojiInterval);
        emojiInterval = null;
    }
    
    emojiInterval = setInterval(() => {
        const emoji = document.createElement('span');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.fontSize = (1.5 + Math.random() * 2) + 'rem';
        emoji.style.animationDuration = (4 + Math.random() * 4) + 's';
        emoji.style.animationDelay = (Math.random() * 2) + 's';
        emojiRain.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 8000);
    }, 200);
}

// ===== SLIDESHOW =====
function initializeSlideshow() {
    photosViewed = 0;
    isSlideshowComplete = false;
    toRatingBtn.style.display = 'none'; // Hide rate button initially
    
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
    
    // Track viewed photos
    if (!isSlideshowComplete) {
        photosViewed++;
        if (photosViewed >= TOTAL_IMAGES) {
            isSlideshowComplete = true;
            toRatingBtn.style.display = 'inline-block';
            toRatingBtn.style.animation = 'pulse 1s infinite';
        }
    }
    
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
    
    function nextPhoto() {
        const next = (currentPhotoIndex + 1) % TOTAL_IMAGES;
        goToPhoto(next);
        
        // Random delay between 5-7 seconds
        const delay = Math.floor(Math.random() * (MAX_PHOTO_DELAY - MIN_PHOTO_DELAY + 1)) + MIN_PHOTO_DELAY;
        slideshowInterval = setTimeout(nextPhoto, delay);
    }
    
    // Start with a random delay
    const delay = Math.floor(Math.random() * (MAX_PHOTO_DELAY - MIN_PHOTO_DELAY + 1)) + MIN_PHOTO_DELAY;
    slideshowInterval = setTimeout(nextPhoto, delay);
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearTimeout(slideshowInterval);
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
        const value = parseInt(btn.dataset.value);
        
        // Allow re-rating - remove previous selection
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
        
        // Update state
        ratingSelected = true;
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
    toRatingBtn.style.display = 'none';
    toSlideshowBtn.style.display = 'none';
    photosViewed = 0;
    isSlideshowComplete = false;
    
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
    
    // Clear typing
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    typingMessage.textContent = '';
    isTypingComplete = false;
    
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

// Add pulse animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE =====
loadImages();
