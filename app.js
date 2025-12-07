// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const indicators = Array.from(document.querySelectorAll('.indicator'));
    
    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayInterval;
    const totalSlides = slides.length;
    let slidesPerView = getSlidesPerView();
    
    // Определяем количество видимых слайдов в зависимости от ширины экрана
    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) {
            return 1; // Мобильные устройства
        } else if (width <= 1024) {
            return 2; // Планшеты
        } else {
            return 3; // Десктоп
        }
    }
    
    // Клонируем слайды для бесконечной прокрутки
    function cloneSlides() {
        slidesPerView = getSlidesPerView();
        
        // Удаляем старые клоны если есть
        const existingClones = track.querySelectorAll('.carousel-slide.clone');
        existingClones.forEach(clone => clone.remove());
        
        // Клонируем все слайды в начало
        for (let i = totalSlides - 1; i >= 0; i--) {
            const clone = slides[i].cloneNode(true);
            clone.classList.add('clone', 'clone-before');
            track.insertBefore(clone, track.firstChild);
        }
        
        // Клонируем все слайды в конец
        for (let i = 0; i < totalSlides; i++) {
            const clone = slides[i].cloneNode(true);
            clone.classList.add('clone', 'clone-after');
            track.appendChild(clone);
        }
    }
    
    // Обновляем позицию карусели
    function updateCarouselPosition(animate = true) {
        const slideWidth = 100 / slidesPerView;
        // Смещение учитывает клонированные слайды в начале (totalSlides штук)
        const offset = -((currentIndex + totalSlides) * slideWidth);
        
        if (animate) {
            track.style.transition = 'transform 0.6s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateX(${offset}%)`;
    }
    
    // Обновляем активный индикатор
    function updateIndicators() {
        const realIndex = ((currentIndex % totalSlides) + totalSlides) % totalSlides;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === realIndex);
        });
    }
    
    // Переход к следующему слайду
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentIndex++;
        updateCarouselPosition();
        updateIndicators();
        
        // Проверяем, достигли ли мы конца
        setTimeout(() => {
            if (currentIndex >= totalSlides) {
                currentIndex = 0;
                updateCarouselPosition(false);
                updateIndicators();
            }
            isTransitioning = false;
        }, 600);
    }
    
    // Переход к предыдущему слайду
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentIndex--;
        updateCarouselPosition();
        updateIndicators();
        
        // Проверяем, достигли ли мы начала
        setTimeout(() => {
            if (currentIndex < 0) {
                currentIndex = totalSlides - 1;
                updateCarouselPosition(false);
                updateIndicators();
            }
            isTransitioning = false;
        }, 600);
    }
    
    // Переход к конкретному слайду
    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        
        currentIndex = index;
        updateCarouselPosition();
        updateIndicators();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
        
        resetAutoplay();
    }
    
    // Автопрокрутка
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            nextSlide();
        }, 4000); // Меняем слайд каждые 4 секунды
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Обработчики событий
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Пауза автопрокрутки при наведении
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    
    // Поддержка свайпов на мобильных устройствах
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Обработка изменения размера окна
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newSlidesPerView = getSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                cloneSlides();
                updateCarouselPosition(false);
            }
        }, 250);
    });
    
    // Поддержка клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });
    
    // Инициализация
    cloneSlides();
    updateCarouselPosition(false);
    updateIndicators();
    startAutoplay();
    
    console.log('Үйлену каруселі іске қосылды!');
}); 


const targetDate = new Date("May 5, 2026 00:00:00").getTime();

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("timer").innerHTML = "<h3>Той уақыты келді! ❤️</h3>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}, 1000);


const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');

// Функция переключения музыки
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
    } else {
        bgMusic.pause();
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    }
}

// Клик по кнопке
musicBtn.addEventListener('click', toggleMusic);

// Включение музыки при первом взаимодействии с экраном
function startMusicOnInteraction() {
    bgMusic.play().then(() => {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
    }).catch(() => {});

    // Убираем обработчики после первого взаимодействия
    window.removeEventListener('click', startMusicOnInteraction);
    window.removeEventListener('touchstart', startMusicOnInteraction);
}

window.addEventListener('click', startMusicOnInteraction);
window.addEventListener('touchstart', startMusicOnInteraction);


const phone = "77770617513"; // ← өз нөміріңізді қойыңыз (плюссыз)

document.getElementById("yesBtn").onclick = () => {
    const url = `https://wa.me/${phone}?text=Иә,%20келем`;
    window.location.href = url;
};

document.getElementById("noBtn").onclick = () => {
    const url = `https://wa.me/${phone}?text=Келе%20алмаймын`;
    window.location.href = url;
};

 const ADMIN_PASSWORD = '77780105';

        // Form submission
        document.getElementById('guestForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                fullName: document.getElementById('fullName').value,
                guestType: document.querySelector('input[name="guestType"]:checked').value,
                numberOfGuests: parseInt(document.getElementById('numberOfGuests').value),
                message: document.getElementById('message').value,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };

            // Save to localStorage
            const guests = JSON.parse(localStorage.getItem('weddingGuests') || '[]');
            guests.push(formData);
            localStorage.setItem('weddingGuests', JSON.stringify(guests));

            // Show success message
            document.getElementById('rsvpForm').style.display = 'none';
            document.getElementById('successMessage').classList.add('show');
            showToast('Рахмет! Сізді тойымызда көргенімізге қуаныштымыз! 💕', 'success');

            // Reset form after 3 seconds
            setTimeout(() => {
                document.getElementById('guestForm').reset();
                document.getElementById('successMessage').classList.remove('show');
                document.getElementById('rsvpForm').style.display = 'block';
            }, 3000);
        });

        // Admin modal functions
        function openAdminModal() {
            document.getElementById('adminModal').classList.add('show');
        }

        function closeAdminModal() {
            document.getElementById('adminModal').classList.remove('show');
            document.getElementById('adminPassword').value = '';
        }

        // Export to Excel
        function exportToExcel() {
            const password = document.getElementById('adminPassword').value;

            if (password !== ADMIN_PASSWORD) {
                showToast('Қате құпия сөз!', 'error');
                document.getElementById('adminPassword').value = '';
                return;
            }

            const guests = JSON.parse(localStorage.getItem('weddingGuests') || '[]');

            if (guests.length === 0) {
                showToast('Экспорттау үшін қонақтар жоқ', 'error');
                closeAdminModal();
                return;
            }

            // Prepare data for Excel
            const excelData = guests.map(guest => {
    let typeText = '';

    switch (guest.guestType) {
        case 'friends':
            typeText = 'Достар';
            break;
        case 'relatives':
            typeText = 'Туыстар';
            break;
        case 'coworkers':
            typeText = 'Жұмыстастар';
            break;
        default:
            typeText = '-';
    }

    return {
        'Толық аты': guest.fullName,
        'Категория': typeText,
        'Қонақтар саны': guest.numberOfGuests,
        'Хабарлама': guest.message || '-',
        'Тіркелген күні': new Date(guest.createdAt).toLocaleString('kk-KZ')
    };
});


            // Create workbook
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Қонақтар');

            // Download file
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `toy_qonaqtary_${today}.xlsx`);

            showToast('Excel файлы сәтті жүктелді!', 'success');
            closeAdminModal();
        }

        // Toast notification
        function showToast(message, type) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = `toast ${type} show`;

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Close modal on outside click
        document.getElementById('adminModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeAdminModal();
            }
        });

        // Enter key for password
        document.getElementById('adminPassword').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                exportToExcel();
            }
        });
