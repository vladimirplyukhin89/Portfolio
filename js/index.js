// функции блокировки/разблокировки скролла

const disabledScroll = () => {

    const widthScroll = window.innerWidth - document.body.offsetWidth;
    /*
    сохраним изначальную позицию в прототипе, чтобы при закрытие модального окна нас 
    не откатывало вверх из-за  position: fixed
    */
    document.body.scrollPosition = window.scrollY;

    document.body.style.cssText = `
    overflow: hidden;
    position: fixed;
    top: -${document.body.scrollPosition}px;
    left: 0;
    height: 100vh;
    width: 100vw;
    padding-right: ${widthScroll}px;
    `;
}

const enabledScroll = () => {
    document.body.style.cssText = 'position: relative';
    window.scroll({ top: document.body.scrollPosition }); // при закрытии откатываемся туда же, где были на странице по скроллу
}

{   // Модальное окно
    const $presentOrderBtn = document.querySelector('.present__order-btn');
    const $pageOverlayModal = document.querySelector('.page__overlay_modal');
    const $modalClose = document.querySelector('.modal__close');

    // Функция манипуляции с модальным окном
    const handlerModal = (openBtn, modalAuth, openSelector, closeTrigger, sm) => {
        // Переменная для анимации модального окна
        let opacity = 0;

        // объект скорости для нашего модального окна
        const speed = {
            slow: 0.02,
            medium: 0.05,
            fast: 0.1,
            default: 0.04,
        }

        const openModal = () => {
            disabledScroll();
            modalAuth.style.opacity = opacity;

            modalAuth.classList.add(openSelector);

            // Функция для анимации модального окна
            // Используем requestAnimationFrame
            const anim = () => {
                opacity += speed[sm];
                modalAuth.style.opacity = opacity;
                if (opacity < 1) requestAnimationFrame(anim);
            }
            requestAnimationFrame(anim)
        }

        const closeModal = () => {
            enabledScroll();
            const anim = () => {
                opacity -= speed[sm];
                modalAuth.style.opacity = opacity;
                if (opacity > 0) {
                    requestAnimationFrame(anim);
                } else {
                    modalAuth.classList.remove(openSelector);
                }
            }
            requestAnimationFrame(anim);
        }
        // открываем модальное окно по крестику
        openBtn.addEventListener('click', openModal);
        // закрываем модальное окно по крестику
        closeTrigger.addEventListener('click', closeModal);
        // закрываем модальное окно по клику вне его 
        modalAuth.addEventListener('click', (e) => {
            if (e.target === modalAuth) closeModal();
        });

    }

    handlerModal($presentOrderBtn,
        $pageOverlayModal,
        'page__overlay_modal_open',
        $modalClose,
        'medium'
    );
}

{
    // Бургер меню
    const headerContacts = document.querySelector('.header__contacts');
    const headerContactsBurger = document.querySelector('.header__contacts-burger');

    const handlerBurger = (openBtn, menu, openSelector) => {
        openBtn.addEventListener('click', () => {

            if (menu.classList.contains(openSelector)) {
                menu.style.height = '';
                menu.classList.remove(openSelector);
            } else {
                menu.style.height = menu.scrollHeight + 'px';
                menu.classList.add(openSelector);
            }
        })
    }

    handlerBurger(headerContactsBurger, headerContacts, 'header__contacts_open')
}