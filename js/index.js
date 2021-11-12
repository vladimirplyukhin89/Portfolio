// функции блокировки/разблокировки скролла

const disabledScroll = () => {

    const widthScroll = window.innerWidth - document.body.offsetWidth;
    /*
    сохраним изначальную позицию в прототипе, чтобы при закрытие модального окна нас 
    не откатывало вверх из-за  position: fixed
    */
    document.documentElement.style.cssText = `
        position: relative;
        height: 100vh;
    `;

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
};

const enabledScroll = () => {
    document.documentElement.style.cssText = '';

    document.body.style.cssText = 'position: relative;';
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

{ // галерея
    const portfolioList = document.querySelector('.portfolio__list');
    const pageOverlay = document.createElement('div');
    pageOverlay.classList.add('page__overlay');


    portfolioList.addEventListener('click', (e) => {

        const card = e.target.closest('.card');

        if (card) {
            disabledScroll();
            document.body.append(pageOverlay);
            const title = card.querySelector('.card__client')

            const picture = document.createElement('picture');

            picture.style.cssText = `
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 1440px;
            `;

            picture.innerHTML = `
                <source srcset="${card.dataset.fullImage}.avif" type="image/avif">
                <source srcset="${card.dataset.fullImage}.webp" type="image/webp">
                <img src="${card.dataset.fullImage}.jpg" alt="${title.textContent}">
            `;

            pageOverlay.append(picture);
        }
    });

    pageOverlay.addEventListener('click', () => {
        enabledScroll();
        pageOverlay.remove();
        pageOverlay.textContent = '';
    })

}