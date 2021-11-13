// функции блокировки/разблокировки скролла

const disabledScroll = () => {

    const widthScroll = window.innerWidth - document.body.offsetWidth;

    if (window.innerWidth >= 992) {
        document.querySelector('.page__header').style.left = '';
    }
    if (window.innerWidth >= 1440) {
        document.querySelector('.page__header').style.left = '';
    }
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
    document.querySelector('.page__header').style.left = '';
    window.scroll({
        top: document.body.scrollPosition
    }); // при закрытии откатываемся туда же, где были на странице по скроллу
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

{ // создание карточек портфолио на основе данных из JSON
    const COUNT_CARD = 2;
    const portfolioList = document.querySelector('.portfolio__list');
    const portfolioAdd = document.querySelector('.portfolio__add');

    const getData = () => fetch('db.json')
        .then((response) => {
            if (response.ok) return response.json()
            else throw `Что-то пошло не так: ошибка ${response.status}`;
        })
        .catch(error => console.log(error));

    const createStore = async () => {
        const data = await getData();
        return {
            data,
            counter: 0,
            count: COUNT_CARD,
            get length() {
                return this.data.length;
            },
            get cardData() {
                const renderData = this.data.slice(this.counter, this.counter + this.count);
                this.counter += renderData.length;
                return renderData;
            },
        }
    }

    const renderCard = data => {

        const cards = data.map((item) => {
            // Деструктуризация
            const { preview, year, type, client, image } = item;

            const li = document.createElement('li');
            li.classList.add('portfolio__item');

            li.innerHTML = `
            <article class="card" tabindex="0" role="button" aria-label="открыть макет" data-full-image="${image}">
              <picture class="card__picture">
                <source srcset="${preview}.avif" type="image/avif">
                <source srcset="${preview}.webp" type="image/webp">
                <img src="${preview}.jpg" alt="превью iphone" width="166" height="103">
              </picture>

              <p class="card__data">
                <span class="card__client">Клиент: ${client}</span>
                <time class="card__date" datetime="${year}">год: ${year}</time>
              </p>

              <h3 class="card__title">${type}</h3>
            </article>
            `;

            return li;
        });

        portfolioList.append(...cards)
    };

    const initPortfolio = async () => {
        const store = await createStore();

        renderCard(store.cardData);

        portfolioAdd.addEventListener('click', () => {
            renderCard(store.cardData);

            if (store.length === store.counter)
                portfolioAdd.remove();
        })
    }

    initPortfolio();
}