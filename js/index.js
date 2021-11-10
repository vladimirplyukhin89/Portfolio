const $presentOrderBtn = document.querySelector('.present__order-btn');
const $pageOverlayModal = document.querySelector('.page__overlay_modal');
const $modalClose = document.querySelector('.modal__close');

// Функция манипуляции с модальным окном
const handlerModal = (openBtn, modalAuth, openSelector, closeTrigger, sk) => {
    // Переменная для анимации модального окна
    let opacity = 0;

    // объект скорости для нашего модального окна
    const speed = {
        slow: 10,
        medium: 5,
        fast: 1,
        default: 3,
    }
    // Переменная для определенния скорости открытия/закрытия модального окна
    let param = speed[sk] ? speed[sk] : speed.default

    openBtn.addEventListener('click', () => {
        modalAuth.style.opacity = opacity;

        modalAuth.classList.add(openSelector);

        // Функция для анимации модального окна
        const timer = setInterval(() => {
            opacity += 0.02;
            modalAuth.style.opacity = opacity;
            if (opacity >= 1) clearInterval(timer);
        }, param)
    });

    closeTrigger.addEventListener('click', () => {
        const timer = setInterval(() => {
            opacity -= 0.02;
            modalAuth.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(timer);
                modalAuth.classList.remove(openSelector);
            }
        }, param)

    });
}

handlerModal($presentOrderBtn,
    $pageOverlayModal,
    'page__overlay_modal_open',
    $modalClose
);
