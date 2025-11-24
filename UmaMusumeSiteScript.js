document.addEventListener('DOMContentLoaded', function() {
    console.log('=== УНИВЕРСАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ САЙТА ===');
    
    // Проверяем наличие элементов
    console.log('Кнопки навигации:', document.querySelectorAll('.nav-link').length);
    console.log('Кнопки лайков:', document.querySelectorAll('.like-btn').length);
    console.log('Посты с новостями:', document.querySelectorAll('.news-post').length);
    
    // Инициализация всех функций
    initUniversalAnimations();
    setActiveNavLink();
    initMobileMenu();
    initializeLikes();
    initNewsPage();
    initGalleryModal();
    
    console.log('=== ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА ===');
});

// ===== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ АНИМАЦИЙ =====
function initUniversalAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    console.log('Инициализация универсальных анимаций:', animatedElements.length, 'элементов');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const index = Array.from(animatedElements).indexOf(element);
                
                const delay = index * 100;
                
                setTimeout(() => {
                    element.classList.add('visible');
                    
                    //  Hover-эффекты после появления для карточек персонажей
                    if (element.classList.contains('character-card')) {
                        setTimeout(() => {
                            element.classList.add('ready-for-hover');
                        }, 600);
                    }
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => observer.observe(element));
    
    // Фоновые персонажи на главной странице
    initBackgroundCharacters();
}

// Фоновая анимация для главной страницы
function initBackgroundCharacters() {
    const bgCharacters = document.querySelectorAll('.bg-character');
    if (bgCharacters.length === 0) return;
    
    setTimeout(() => {
        bgCharacters.forEach(char => char.classList.add('visible'));
    }, 1000);
}

// Система лайков
function initializeLikes() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    // Загружаем сохраненные лайки из localStorage
    let likesData = JSON.parse(localStorage.getItem('umaMusumeLikes')) || {};
    
    likeButtons.forEach(button => {
        const character = button.dataset.character;
        
        if (!character) return;
        
        // Восстанавливаем состояние кнопки
        if (likesData[character]) {
            button.classList.add('liked');
            const countElement = button.querySelector('.like-count');
            if (countElement) {
                countElement.textContent = likesData[character];
            }
        }
        
        // Обработчик клика
        button.addEventListener('click', function() {
            toggleLike(character, this);
        });
    });
}

function toggleLike(character, button) {
    let likesData = JSON.parse(localStorage.getItem('umaMusumeLikes')) || {};
    const countElement = button.querySelector('.like-count');
    
    if (!countElement) return;
    
    if (button.classList.contains('liked')) {
        // Убираем лайк
        likesData[character] = (likesData[character] || 1) - 1;
        if (likesData[character] <= 0) {
            delete likesData[character];
            button.classList.remove('liked');
            countElement.textContent = '0';
        } else {
            countElement.textContent = likesData[character];
        }
    } else {
        // Добавляем лайк
        likesData[character] = (likesData[character] || 0) + 1;
        button.classList.add('liked');
        countElement.textContent = likesData[character];
        
        // Анимация "пульсации"
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('umaMusumeLikes', JSON.stringify(likesData));
    
    // Показываем общую статистику
    showTotalLikes();
}

function showTotalLikes() {
    const likesData = JSON.parse(localStorage.getItem('umaMusumeLikes')) || {};
    const totalLikes = Object.values(likesData).reduce((sum, count) => sum + count, 0);
    console.log(`Всего лайков: ${totalLikes}`);
}

// Навигация и активные ссылки
function setActiveNavLink() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('/').pop();
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

function getCurrentPage() {
    // Получаем текущий URL
    const path = window.location.href;
    
    // Если это file:// протокол, извлекаем имя файла
    if (path.startsWith('file://')) {
        return path.split('/').pop() || 'UmaMusumeSite.html';
    }
    
    // Для HTTP протокола
    return window.location.pathname.split('/').pop() || 'UmaMusumeSite.html';
}

// Мобильное меню
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const headerNav = document.querySelector('.header-nav');
    
    if (navToggle && headerNav) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            headerNav.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        const navLinks = headerNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                headerNav.classList.remove('active');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-wrapper') && !e.target.closest('.nav-toggle')) {
                navToggle.classList.remove('active');
                headerNav.classList.remove('active');
            }
        });

        // Закрытие меню при ресайзе окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navToggle.classList.remove('active');
                headerNav.classList.remove('active');
            }
        });
    }
}

// Функция для работы с новостями
function initNewsPage() {
    console.log('Инициализация страницы новостей');
    
    // Кнопка "Подробнее"
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach((button) => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const post = this.closest('.news-post');
            const fullContent = post.querySelector('.post-full-content');
            
            if (!fullContent) return;
            
            if (fullContent.classList.contains('hidden')) {
                fullContent.classList.remove('hidden');
                this.textContent = 'Свернуть';
            } else {
                fullContent.classList.add('hidden');
                this.textContent = 'Подробнее';
            }
        });
    });
}

// Модальное окно для просмотра изображений в галерее
function initGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!modal) return;
    
    console.log('Инициализация модального окна галереи');
    
    // Открытие модального окна
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('.gallery-image');
            const caption = this.querySelector('.gallery-caption').innerHTML;
            
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalCaption.innerHTML = caption;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Закрытие модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    // Закрытие по клику вне изображения
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}