      // !!! каталог - блок стоимость, изменение цены и ползунок

// Оборачиваем весь код в функцию
function initRangeSlider() {
// Получаем элементы
    const rangeScale = document.querySelector('.range-scale');
    if (!rangeScale) {
        console.error('Элемент .range-scale не найден');
        return;
    }

    const rangeBar = rangeScale.querySelector('.range-bar');
    const minToggle = document.querySelector('.range-toggle');
    const maxToggle = document.querySelector('.toggle-max');

// Получаем поля ввода цен
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

// Кнопка сброса
    const resetButton = document.querySelector('.button-reset');

// Проверка существования всех элементов
    if (!rangeBar || !minToggle || !maxToggle || !minPriceInput || !maxPriceInput) {
        console.error('Не все элементы найдены');
        return;
    }

// Константы для цен
    const MIN_PRICE = 0; // минимальная цена
    const MAX_PRICE = 10000; // МАКСИМАЛЬНАЯ ВОЗМОЖНАЯ цена
    const DEFAULT_MAX_PRICE = 10000; // НАЧАЛЬНАЯ максимальная цена

// Константы для ползунка
    const maxLimitPx = 267; // КРАЙНЕЕ ПОЛОЖЕНИЕ 267px
    const STEP_PRICE = 50; // ШАГ ИЗМЕНЕНИЯ ЦЕНЫ 50
    const stepPx = (STEP_PRICE / MAX_PRICE) * maxLimitPx; // Шаг в пикселях

    console.log(`Настройки ползунка:`);
    console.log(`- Крайнее положение: ${maxLimitPx}px`);
    console.log(`- Шаг изменения: ${STEP_PRICE}₽ = ${stepPx.toFixed(2)}px`);
    console.log(`- Макс. цена: ${MAX_PRICE}₽ (${maxLimitPx}px)`);
    console.log(`- Всего шагов: ${MAX_PRICE / STEP_PRICE} шагов по ${STEP_PRICE}₽`);

// Вычисляем начальную позицию правой ручки
    const maxStartPx = Math.round((DEFAULT_MAX_PRICE / MAX_PRICE) * maxLimitPx); // 267px для 10000₽

// Улучшенная утилитарная функция
    function getPixelValue(element, defaultValue = 0) {
        if (!element) return defaultValue;
        const style = window.getComputedStyle(element);
        const left = style.left;
        const value = parseFloat(left);
        return isNaN(value) ? defaultValue : value;
    }

// Функции для конвертации цена ↔ пиксели
    function priceToPixels(price) {
        return (price / MAX_PRICE) * maxLimitPx;
    }

    function pixelsToPrice(pixels) {
        const price = (pixels / maxLimitPx) * MAX_PRICE;
// Округляем до шага 50
        return Math.round(price / STEP_PRICE) * STEP_PRICE;
    }

// Функция для выравнивания по шагу
    function snapToStep(pixels) {
        const price = (pixels / maxLimitPx) * MAX_PRICE;
        const snappedPrice = Math.round(price / STEP_PRICE) * STEP_PRICE;
        const snappedPixels = (snappedPrice / MAX_PRICE) * maxLimitPx;
        return Math.max(0, Math.min(snappedPixels, maxLimitPx));
    }

// Функция updateRange - обновляет ползунок и синхронизирует с инпутами
    function updateRange() {
        const minLeft = getPixelValue(minToggle, 0);
        const maxLeft = getPixelValue(maxToggle, maxStartPx);

// Ширина диапазона
        const width = Math.max(0, maxLeft - minLeft);

// Обновляем ползунок
        rangeBar.style.left = `${minLeft}px`;
        rangeBar.style.width = `${width}px`;

// Конвертируем пиксели в цены (с округлением до шага 50)
        const minPrice = pixelsToPrice(minLeft);
        const maxPrice = pixelsToPrice(maxLeft);

// Обновляем поля ввода
        minPriceInput.value = minPrice;
        maxPriceInput.value = maxPrice;

        console.log(`Обновление: ${minPrice}₽ - ${maxPrice}₽ (${minLeft.toFixed(1)}px - ${maxLeft.toFixed(1)}px)`);
    }

// Функция обновления ползунка по значению из инпутов
    function updateSliderFromInputs() {
// Получаем значения из инпутов с валидацией
        let minPrice = parseInt(minPriceInput.value);
        let maxPrice = parseInt(maxPriceInput.value);

// Если значения не числа, используем значения по умолчанию
        if (isNaN(minPrice)) minPrice = MIN_PRICE;
        if (isNaN(maxPrice)) maxPrice = DEFAULT_MAX_PRICE;

// Валидация: минимальная цена не может быть больше максимальной
        if (minPrice > maxPrice) {
            [minPrice, maxPrice] = [maxPrice, minPrice];
            minPriceInput.value = minPrice;
            maxPriceInput.value = maxPrice;
        }

// Ограничиваем значения (0-10000)
        minPrice = Math.max(MIN_PRICE, Math.min(minPrice, MAX_PRICE));
        maxPrice = Math.max(MIN_PRICE, Math.min(maxPrice, MAX_PRICE));

// Округляем до шага 50
        minPrice = Math.round(minPrice / STEP_PRICE) * STEP_PRICE;
        maxPrice = Math.round(maxPrice / STEP_PRICE) * STEP_PRICE;

// Конвертируем цены в пиксели
        const minPixels = priceToPixels(minPrice);
        const maxPixels = priceToPixels(maxPrice);

// Обновляем позиции ручек
        minToggle.style.left = `${minPixels}px`;
        maxToggle.style.left = `${maxPixels}px`;

// Обновляем визуальную часть ползунка
        updateRange();

        console.log(`Ручное обновление из инпутов: ${minPrice}₽ - ${maxPrice}₽`);
    }

// Переменные для перетаскивания
    let dragging = null;
    let dragStartX = 0;
    let dragStartLeft = 0;
    let currentRect = null;

// Функции для перетаскивания
    function onMouseDown(e) {
        dragging = e.target;
        dragStartX = e.clientX;
        dragStartLeft = getPixelValue(dragging,
            dragging === maxToggle ? maxStartPx : 0
        );

// Получаем текущие координаты ползунка
        currentRect = rangeScale.getBoundingClientRect();

// Добавляем глобальные обработчики
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        e.preventDefault();
    }

    function onMouseMove(e) {
        if (!dragging || !currentRect) return;

        let newLeft = e.clientX - currentRect.left;

// Ограничиваем в пределах ползунка (0-267px)
        newLeft = Math.max(0, Math.min(newLeft, maxLimitPx));

// Выравниваем по шагу 50 при перетаскивании
        newLeft = snapToStep(newLeft);

// Минимальный отступ между ручками (500 = 10 шагов)
        const MIN_GAP_PX = priceToPixels(500); // 500 отступ

        if (dragging === minToggle) {
            const maxCurrent = getPixelValue(maxToggle, maxStartPx);
            newLeft = Math.min(newLeft, maxCurrent - MIN_GAP_PX);
            minToggle.style.left = `${newLeft}px`;
        } else if (dragging === maxToggle) {
            const minCurrent = getPixelValue(minToggle, 0);
            newLeft = Math.max(newLeft, minCurrent + MIN_GAP_PX);
            newLeft = Math.min(newLeft, maxLimitPx);
            maxToggle.style.left = `${newLeft}px`;
        }

        updateRange();
    }

    function onMouseUp() {
        dragging = null;
        currentRect = null;

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

// Инициализация ползунка
    function initSlider() {
// Устанавливаем начальные позиции
        const minPixels = priceToPixels(MIN_PRICE); // 0px
        const maxPixels = priceToPixels(DEFAULT_MAX_PRICE); // 267px

        minToggle.style.left = `${snapToStep(minPixels)}px`;
        maxToggle.style.left = `${snapToStep(maxPixels)}px`;

// Инициализируем поля ввода
        minPriceInput.value = MIN_PRICE;
        maxPriceInput.value = DEFAULT_MAX_PRICE;

        updateRange();

        console.log(`Ползунок инициализирован. Диапазон: ${MIN_PRICE}-${MAX_PRICE}₽, шаг: ${STEP_PRICE}₽`);
    }

// Улучшенные обработчики для полей ввода
    function setupInputHandlers() {
// Debounce функция
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        const debouncedUpdate = debounce(updateSliderFromInputs, 1000);

// Событие input для отслеживания ввода
        minPriceInput.addEventListener('input', function(e) {
            console.log('Input min:', this.value);
            debouncedUpdate();
        });

        maxPriceInput.addEventListener('input', function(e) {
            console.log('Input max:', this.value);
            debouncedUpdate();
        });

// Событие change для надежности
        minPriceInput.addEventListener('change', updateSliderFromInputs);
        maxPriceInput.addEventListener('change', updateSliderFromInputs);

// Событие blur
        minPriceInput.addEventListener('blur', updateSliderFromInputs);
        maxPriceInput.addEventListener('blur', updateSliderFromInputs);

// Обработка клавиш в полях ввода
        minPriceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                updateSliderFromInputs();
            }
// Обработка стрелок вверх/вниз с шагом 50
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                let value = parseInt(this.value) || MIN_PRICE;
                value = Math.min(MAX_PRICE, value + STEP_PRICE);
                this.value = value;
                updateSliderFromInputs();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                let value = parseInt(this.value) || MIN_PRICE;
                value = Math.max(MIN_PRICE, value - STEP_PRICE);
                this.value = value;
                updateSliderFromInputs();
            }
        });

        maxPriceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                updateSliderFromInputs();
            }
// Обработка стрелок вверх/вниз с шагом 50
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                let value = parseInt(this.value) || MIN_PRICE;
                value = Math.min(MAX_PRICE, value + STEP_PRICE);
                this.value = value;
                updateSliderFromInputs();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                let value = parseInt(this.value) || MIN_PRICE;
                value = Math.max(MIN_PRICE, value - STEP_PRICE);
                this.value = value;
                updateSliderFromInputs();
            }
        });

// Валидация
        minPriceInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (!isNaN(value) && value > MAX_PRICE) {
                this.value = MAX_PRICE;
            }
        });

        maxPriceInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (!isNaN(value) && value > MAX_PRICE) {
                this.value = MAX_PRICE;
            }
        });
    }

// Обработчик для кнопки сброса
    function setupResetButton() {
        if (resetButton) {
            resetButton.addEventListener('click', function(e) {
                if (this.type === 'reset') {
                    e.preventDefault();
                }

                minPriceInput.value = MIN_PRICE;
                maxPriceInput.value = DEFAULT_MAX_PRICE;

// Сбрасываем ползунок
                const minPixels = priceToPixels(MIN_PRICE);
                const maxPixels = priceToPixels(DEFAULT_MAX_PRICE);
                minToggle.style.left = `${snapToStep(minPixels)}px`;
                maxToggle.style.left = `${snapToStep(maxPixels)}px`;

                updateRange();

                console.log('Сброс до:', MIN_PRICE + '-' + DEFAULT_MAX_PRICE + '₽');
            });
        }
    }

// Улучшенные обработчики для ручек (клавиатура)
    function setupSliderHandlers() {
        [minToggle, maxToggle].forEach(btn => {
            btn.addEventListener('mousedown', onMouseDown);

 // Обработчик для тач-устройств
        btn.addEventListener('touchstart', function(e) {
            if (e.cancelable) e.preventDefault();
            const touch = e.touches[0];

// Создаем симулированное событие мыши
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true,
                cancelable: true
            });
            btn.dispatchEvent(mouseEvent);
        });

// Обработчик для touchmove
        document.addEventListener('touchmove', function(e) {
            if (dragging && e.cancelable) {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true,
                    cancelable: true
                });
                onMouseMove(mouseEvent);
            }
        }, { passive: false });

// Обработчик для touchend
        document.addEventListener('touchend', function(e) {
            if (dragging) {
                onMouseUp();
                if (e.cancelable) e.preventDefault();
            }
        });

// Обработчик для touchcancel
        document.addEventListener('touchcancel', function() {
            if (dragging) {
                onMouseUp();
            }
        });

// Добавляем поддержку клавиатуры
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('role', 'slider');
            btn.setAttribute('aria-valuemin', MIN_PRICE);
            btn.setAttribute('aria-valuemax', MAX_PRICE);

// Обновляем ARIA атрибуты
            const updateAria = () => {
                const current = getPixelValue(btn);
                const price = pixelsToPrice(current);
                btn.setAttribute('aria-valuenow', price);
                btn.setAttribute('aria-valuetext', `${price} рублей`);
            };

            btn.addEventListener('keydown', function(e) {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

                e.preventDefault();
                const current = getPixelValue(e.target);
                let newValue = current;

 // Рассчитываем шаг в пикселях для 50
                const keyStepPx = stepPx; // Шаг в пикселях для 50

                switch(e.key) {
                    case 'ArrowLeft':
                        newValue = Math.max(0, current - keyStepPx);
                        break;
                    case 'ArrowRight':
                        newValue = Math.min(maxLimitPx, current + keyStepPx);
                        break;
                    case 'Home':
                        newValue = 0;
                        break;
                    case 'End':
                        newValue = maxLimitPx;
                        break;
                }

                newValue = snapToStep(newValue);

// Минимальный отступ между ручками (500)
                const MIN_GAP_PX = priceToPixels(500);
                if (e.target === minToggle) {
                    const maxCurrent = getPixelValue(maxToggle, maxStartPx);
                    newValue = Math.min(newValue, maxCurrent - MIN_GAP_PX);
                } else {
                    const minCurrent = getPixelValue(minToggle, 0);
                    newValue = Math.max(newValue, minCurrent + MIN_GAP_PX);
                    newValue = Math.min(newValue, maxLimitPx);
                }

                e.target.style.left = `${newValue}px`;
                updateAria();
                updateRange();

                const newPrice = pixelsToPrice(newValue);
                console.log(`Клавиша ${e.key}: ${newValue.toFixed(1)}px = ${newPrice}₽ (шаг ${STEP_PRICE}₽)`);
            });

// Инициализируем ARIA атрибуты
            updateAria();
        });
    }

// Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const minPrice = parseInt(minPriceInput.value) || MIN_PRICE;
            const maxPrice = parseInt(maxPriceInput.value) || DEFAULT_MAX_PRICE;

            const minPixels = priceToPixels(minPrice);
            const maxPixels = priceToPixels(maxPrice);

            minToggle.style.left = `${snapToStep(minPixels)}px`;
            maxToggle.style.left = `${snapToStep(maxPixels)}px`;

            updateRange();
        }, 100);
    });

// Кастомное событие
    function dispatchPriceChange() {
        const event = new CustomEvent('priceFilterChange', {
            detail: {
                minPrice: parseInt(minPriceInput.value) || MIN_PRICE,
                maxPrice: parseInt(maxPriceInput.value) || DEFAULT_MAX_PRICE,
                step: STEP_PRICE
            },
            bubbles: true
        });
        rangeScale.dispatchEvent(event);
    }

// Модифицируем updateRange
    const originalUpdateRange = updateRange;
    updateRange = function() {
        originalUpdateRange();
        dispatchPriceChange();
    };

// Запускаем инициализацию
    initSlider();
    setupInputHandlers();
    setupSliderHandlers();
    setupResetButton();

// Возвращаем API
    return {
        setPrices: function(min, max) {
            minPriceInput.value = Math.max(MIN_PRICE, Math.min(min, MAX_PRICE));
            maxPriceInput.value = Math.max(MIN_PRICE, Math.min(max, MAX_PRICE));
            updateSliderFromInputs();
        },
        getPrices: function() {
            return {
                min: parseInt(minPriceInput.value) || MIN_PRICE,
                max: parseInt(maxPriceInput.value) || DEFAULT_MAX_PRICE
            };
        },
        getStep: function() {
            return STEP_PRICE;
        }
    };
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.priceFilter = initRangeSlider();
        console.log('Фильтр цен загружен. Шаг изменения: 50');
    });
} else {
    window.priceFilter = initRangeSlider();
    console.log('Фильтр цен загружен. Шаг изменения: 50');
}









      // !!! шапка - избранное, каталог - кнопки избранного (добавление/удаление в избранное)

(function() {
// Проверяем, был ли уже запущен этот код
    if (window.favoritesCounterInitialized) return;
    window.favoritesCounterInitialized = true;

// Основная функция инициализации счетчика
    function initFavoritesCounter() {
        const favoritesIcon = document.querySelector('.navigation-user-link-favourites');
        if (!favoritesIcon) return;

// ВСЕГДА считаем количество избранных из фактических состояний кнопок
        let currentCounter = countAllSavedFavorites();

// Очищаем старый некорректный счетчик если есть расхождение
        const oldCounter = getOldCounterFromStorage();
        if (oldCounter !== currentCounter) {
            console.log(`Коррекция счетчика: было ${oldCounter}, стало ${currentCounter}`);
// Сохраняем корректное значение
            localStorage.setItem('favoritesCounter', currentCounter);
        }
// Обновляем отображение счетчика
        updateCounterDisplay(currentCounter, favoritesIcon);

// Добавляем обработчики только если есть кнопки
        const buttons = document.querySelectorAll('.add-favorites-button, .favorites-button');
        if (buttons.length > 0) {
            initButtons(buttons, currentCounter, favoritesIcon);
        }
    }

// Функция получения старого счетчика из localStorage
    function getOldCounterFromStorage() {
        try {
            const savedCounter = localStorage.getItem('favoritesCounter');
            if (savedCounter !== null && savedCounter !== undefined) {
                const parsed = parseInt(savedCounter);
                if (!isNaN(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.log('Ошибка загрузки старого счетчика:', e);
        }
        return 0;
    }

// Функция обновления отображения счетчика
    function updateCounterDisplay(count, icon) {
// Убираем старые динамические стили
        const oldStyle = document.getElementById('favorites-counter-global');
        if (oldStyle) oldStyle.remove();

// Создаем новые стили
        const style = document.createElement('style');
        style.id = 'favorites-counter-global';

        if (count === 0) {
            style.textContent = '.navigation-user-link-favourites::after { display: none !important; }';
        } else {
            style.textContent = `.navigation-user-link-favourites::after {
                content: "${count}" !important;
                display: flex !important;
            }`;
        }

        document.head.appendChild(style);

// Обновляем скринридер
        const visuallyHidden = icon.querySelector('.visually-hidden');
        if (visuallyHidden) {
            visuallyHidden.textContent = `Понравившиеся отели ${count}.`;
        }
    }

// Функция для получения уникального ключа кнопки
    function getButtonKey(button) {
// Используем стабильные данные из структуры DOM

// Ищем ближайший контейнер с данными
        const container = button.closest('[data-hotel-id], [data-id], [data-key], [data-index]');
        if (container) {
            if (container.dataset.hotelId) return `hotel_${container.dataset.hotelId}`;
            if (container.dataset.id) return `hotel_${container.dataset.id}`;
            if (container.dataset.key) return `key_${container.dataset.key}`;
            if (container.dataset.index) return `index_${container.dataset.index}`;
        }

// Ищем уникальный текст в карточке
        const card = button.closest('.hotels-card, .hotel-card, .card, article, section, .item, .product, li');
        if (card) {
// Ищем заголовок
            const title = card.querySelector('h1, h2, h3, h4, h5, h6, .title, .name, .hotel-name, .hotels-card-title');
            if (title && title.textContent.trim()) {
                return `title_${title.textContent.trim().replace(/\s+/g, '_').substring(0, 40)}`;
            }

// Ищем первый абзац
            const firstParagraph = card.querySelector('p, .description, .text');
            if (firstParagraph && firstParagraph.textContent.trim()) {
                const text = firstParagraph.textContent.trim().substring(0, 50);
                return `desc_${text.replace(/\s+/g, '_')}`;
            }

// Используем весь текст карточки для хэша
            const cardText = card.textContent.trim().substring(0, 100);
            if (cardText) {
                let hash = 0;
                for (let i = 0; i < cardText.length; i++) {
                    hash = ((hash << 5) - hash) + cardText.charCodeAt(i);
                    hash = hash & hash;
                }
                return `card_${Math.abs(hash)}`;
            }
        }

// Используем структуру DOM (путь)
        const path = getElementPath(button);
        let pathHash = 0;
        for (let i = 0; i < path.length; i++) {
            pathHash = ((pathHash << 5) - pathHash) + path.charCodeAt(i);
            pathHash = pathHash & pathHash;
        }

        return `path_${Math.abs(pathHash)}`;
    }

// Функция для получения пути элемента в DOM
    function getElementPath(element) {
        const path = [];
        let current = element;

        for (let i = 0; i < 5 && current && current !== document.body; i++) {
            const tag = current.tagName.toLowerCase();
            const id = current.id ? `#${current.id}` : '';
            const className = current.className && typeof current.className === 'string' ?
                `.${current.className.split(' ')[0]}` : '';
            const siblingIndex = Array.from(current.parentNode.children).indexOf(current);

            path.unshift(`${tag}${id}${className}:${siblingIndex}`);
            current = current.parentElement;
        }

        return path.join(' > ');
    }

// Функция сохранения состояния кнопки
    function saveButtonState(buttonKey, isFavorite) {
        const buttonStates = JSON.parse(localStorage.getItem('favoritesButtonStates')) || {};
        if (isFavorite) {
            buttonStates[buttonKey] = true;
        } else {
            delete buttonStates[buttonKey];
        }
        localStorage.setItem('favoritesButtonStates', JSON.stringify(buttonStates));

// Сразу обновляем счетчик на основе нового состояния
        const newCounter = Object.keys(buttonStates).length;
        localStorage.setItem('favoritesCounter', newCounter);
        return newCounter;
    }

// Функция восстановления состояния кнопок
    function restoreButtonStates(buttons) {
        const buttonStates = JSON.parse(localStorage.getItem('favoritesButtonStates')) || {};
        let restoredCount = 0;

        buttons.forEach(button => {
            const buttonKey = getButtonKey(button);
            if (buttonStates[buttonKey]) {
                if (button.classList.contains('add-favorites-button')) {
                    button.classList.remove('add-favorites-button');
                    button.classList.add('favorites-button');
                    button.textContent = 'в избранном';
                }
                restoredCount++;
            } else {
// Убедимся, что кнопки, которых нет в хранилище, не помечены как избранные
                if (button.classList.contains('favorites-button')) {
                    button.classList.remove('favorites-button');
                    button.classList.add('add-favorites-button');
                    button.textContent = 'в избранное';
                }
            }
        });

        return restoredCount;
    }

// Функция подсчета всех сохраненных избранных отелей
    function countAllSavedFavorites() {
        try {
            const buttonStates = JSON.parse(localStorage.getItem('favoritesButtonStates')) || {};
            const count = Object.keys(buttonStates).length;
            console.log('Количество избранных в хранилище:', count);
            return count;
        } catch (e) {
            console.log('Ошибка подсчета избранных:', e);
            return 0;
        }
    }

// Функция очистки некорректных данных
    function cleanupIncorrectData() {
        try {
            const buttonStates = JSON.parse(localStorage.getItem('favoritesButtonStates')) || {};
            const buttonStatesCount = Object.keys(buttonStates).length;
            const savedCounter = parseInt(localStorage.getItem('favoritesCounter')) || 0;

            if (savedCounter > buttonStatesCount) {
                console.log(`Очистка: счетчик (${savedCounter}) > состояний кнопок (${buttonStatesCount})`);
// Устанавливаем корректное значение
                localStorage.setItem('favoritesCounter', buttonStatesCount);
                return buttonStatesCount;
            }
        } catch (e) {
            console.log('Ошибка очистки данных:', e);
        }
        return 0;
    }

// Функция инициализации кнопок
    function initButtons(buttons, initialCounter, icon) {
        let currentCounter = initialCounter;

// Очищаем некорректные данные перед началом
        currentCounter = cleanupIncorrectData();

// Восстанавливаем состояние кнопок
        const restoredCount = restoreButtonStates(buttons);

// Синхронизируем счетчик с восстановленными кнопками
        if (restoredCount !== currentCounter) {
            console.log(`Синхронизация: восстановлено ${restoredCount} кнопок, счетчик был ${currentCounter}`);
            currentCounter = restoredCount;
            localStorage.setItem('favoritesCounter', currentCounter);
        }

// Обработчик клика по кнопке
        function buttonClickHandler() {
            const button = this;
            const buttonKey = getButtonKey(button);
            const isFavorite = button.classList.contains('favorites-button');

            if (!isFavorite) {
// Добавляем в избранное
                button.classList.remove('add-favorites-button');
                button.classList.add('favorites-button');
                button.textContent = 'в избранном';
                currentCounter = saveButtonState(buttonKey, true);
            } else {
// Удаляем из избранного
                button.classList.remove('favorites-button');
                button.classList.add('add-favorites-button');
                button.textContent = 'в избранное';
                currentCounter = saveButtonState(buttonKey, false);
            }

// Обновляем отображение
            updateCounterDisplay(currentCounter, icon);
        }

// Добавляем обработчики только для кнопок без обработчика
        buttons.forEach(button => {
            if (!button.hasAttribute('data-favorite-listener')) {
                button.setAttribute('data-favorite-listener', 'true');
                button.addEventListener('click', buttonClickHandler);
            }
        });

// Наблюдатель для динамически добавленных кнопок
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(function(mutations) {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
// Проверяем новые элементы
                        const newElements = [];
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                if (node.matches && node.matches('.add-favorites-button, .favorites-button')) {
                                    newElements.push(node);
                                }
                                if (node.querySelectorAll) {
                                    const childButtons = node.querySelectorAll('.add-favorites-button, .favorites-button');
                                    childButtons.forEach(btn => newElements.push(btn));
                                }
                            }
                        });

                        if (newElements.length > 0) {
// Восстанавливаем состояние для новых кнопок
                            restoreButtonStates(newElements);

// Добавляем обработчики
                            newElements.forEach(button => {
                                if (!button.hasAttribute('data-favorite-listener')) {
                                    button.setAttribute('data-favorite-listener', 'true');
                                    button.addEventListener('click', buttonClickHandler);
                                }
                            });
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

// Запускаем при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFavoritesCounter);
    } else {
        initFavoritesCounter();
    }
})();



      // !!! каталог - фильтр карточек отелей

// Инициализация фильтра для сортировки карточек отелей
function initHotelsFilterEnhanced() {
    // Находим элементы DOM
    const selectElement = document.querySelector('.select-control');
    const hotelsList = document.querySelector('.hotels-list');

// Проверяем наличие необходимых элементов
    if (!selectElement || !hotelsList) {
        console.warn('Элементы фильтра не найдены на странице');
        return;
    }

// Сохраняем исходный порядок карточек (для возможного восстановления)
    const originalOrder = Array.from(hotelsList.querySelectorAll('.hotels-card'));

// Восстанавливаем ранее выбранный фильтр из localStorage
    const savedFilter = localStorage.getItem('hotelsFilter');
    const isSavedFilterValid = savedFilter && selectElement.querySelector(`option[value="${savedFilter}"]`);

    if (isSavedFilterValid) {
        selectElement.value = savedFilter;
// Применяем сохраненный фильтр с небольшой задержкой после загрузки DOM
        setTimeout(() => applyFilter(savedFilter), 100);
    }

// Извлекает числовое значение цены из карточки отеля
    function getPriceValue(card) {
        const priceElement = card.querySelector('.hotels-price');
        if (!priceElement) {
            console.warn('Элемент с ценой не найден в карточке:', card);
            return 0;
        }

        const priceText = priceElement.textContent.trim();
        const price = parseInt(priceText, 10);

        return isNaN(price) ? 0 : price;
    }

//  Извлекает числовое значение рейтинга из карточки отеля
    function getRatingValue(card) {
        const ratingElement = card.querySelector('.hotels-rating');
        if (!ratingElement) {
            console.warn('Элемент с рейтингом не найден в карточке:', card);
            return 0;
        }

        const ratingText = ratingElement.textContent.trim();
// Заменяем запятую на точку для корректного парсинга десятичных чисел
        const rating = parseFloat(ratingText.replace(',', '.'));

        return isNaN(rating) ? 0 : rating;
    }

// Применяет выбранный фильтр сортировки к карточкам отелей
    function applyFilter(filterValue) {
// Получаем все карточки из текущего DOM
        const hotelsCards = Array.from(hotelsList.querySelectorAll('.hotels-card'));

// Инициируем анимацию исчезновения
        startDisappearanceAnimation(hotelsCards);

// Даем время для начала анимации перед сортировкой
        setTimeout(() => {
// Сортируем карточки в соответствии с выбранным фильтром
            sortCardsByFilter(hotelsCards, filterValue);

// Обновляем DOM с отсортированными карточками
            updateHotelsList(hotelsCards, filterValue);

// Сохраняем выбор пользователя
            saveFilterPreference(filterValue);
        }, 300);
    }

// запускает анимацию исчезновения карточек
    function startDisappearanceAnimation(cards) {
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
// Гарантируем, что transition применен
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

// Сортирует карточки согласно выбранному фильтру
    function sortCardsByFilter(cards, filterValue) {
        switch(filterValue) {
            case 'cheap':
// Сортировка по возрастанию цены (от дешевых к дорогим)
                cards.sort((cardA, cardB) => {
                    return getPriceValue(cardA) - getPriceValue(cardB);
                });
                break;

            case 'expensive':
// Сортировка по убыванию цены (от дорогих к дешевым)
                cards.sort((cardA, cardB) => {
                    return getPriceValue(cardB) - getPriceValue(cardA);
                });
                break;

            case 'popular':
// Сортировка по убыванию рейтинга (от высокого к низкому)
                cards.sort((cardA, cardB) => {
                    return getRatingValue(cardB) - getRatingValue(cardA);
                });
                break;

            default:
// Возвращаем исходный порядок (по индексу в исходном массиве)
                cards.sort((cardA, cardB) => {
                    const indexA = originalOrder.indexOf(cardA);
                    const indexB = originalOrder.indexOf(cardB);
                    return indexA - indexB;
                });
        }
    }

// Обновляет список отелей в DOM с анимацией появления
    function updateHotelsList(sortedCards, filterValue) {
// Очищаем контейнер перед добавлением отсортированных карточек
        hotelsList.innerHTML = '';

// Добавляем карточки с задержкой для анимации появления
        sortedCards.forEach((card, index) => {
            hotelsList.appendChild(card);

// Анимация появления с последовательной задержкой
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });

        console.log(`Карточки отсортированы по: ${filterValue}`);
    }

// Сохраняет выбранный фильтр в localStorage для восстановления при следующем посещении
    function saveFilterPreference(filterValue) {
        try {
            localStorage.setItem('hotelsFilter', filterValue);
        } catch (error) {
            console.warn('Не удалось сохранить настройки фильтра в localStorage:', error);
        }
    }

// Обработчик изменения выбора в select-элементе

    function handleFilterChange() {
        const selectedValue = this.value;
        applyFilter(selectedValue);
    }

// Назначаем обработчик события изменения фильтра
    selectElement.addEventListener('change', handleFilterChange);

// Добавляем CSS класс для плавных переходов, если его еще нет
    if (!document.querySelector('#hotels-filter-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'hotels-filter-styles';
        styleElement.textContent = `
            .hotels-card {
                transition: opacity 0.3s ease, transform 0.3s ease;
                will-change: opacity, transform;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Инициализация фильтра при полной загрузке DOM

function initializeOnDOMReady() {
    // Проверяем состояние готовности DOM
    if (document.readyState === 'loading') {
// DOM еще загружается, ждем события
        document.addEventListener('DOMContentLoaded', initHotelsFilterEnhanced);
    } else {
// DOM уже загружен, инициализируем сразу
        initHotelsFilterEnhanced();
    }
}

// Запускаем инициализацию
initializeOnDOMReady();



      // !!! Каталог - изменение количества найденых гостиниц

// Управление счетчиком найденных гостиниц
class HotelsCounter {
    constructor() {
        this.counterElement = document.querySelector('.sorting-hotels-quantity');
        this.hotelsContainer = document.querySelector('.hotels-list');
        this.observer = null;
        this.init();
    }

// Инициализация счетчика
    init() {
        if (!this.counterElement) {
            console.warn('Элемент счетчика не найден');
            return;
        }

// Первоначальное обновление
        this.update();

// Настраиваем наблюдение за изменениями DOM
        this.setupMutationObserver();

// Следим за изменениями через события (если есть фильтрация)
        this.setupEventListeners();
    }

// Обновляет счетчик на основе текущего количества карточек
    update() {
        if (!this.counterElement) return;

        let count = 0;

        if (this.hotelsContainer) {
// Считаем только видимые карточки (если есть скрытые фильтрами)
            const visibleCards = Array.from(this.hotelsContainer.querySelectorAll('.hotels-card'))
                .filter(card => {
                    const style = window.getComputedStyle(card);
                    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                });
            count = visibleCards.length;
        } else {
// Если контейнера нет, ищем карточки по всему документу
            const allCards = document.querySelectorAll('.hotels-card');
            count = allCards.length;
        }

        this.counterElement.textContent = count;
        this.counterElement.setAttribute('data-count', count);

// Обновляем заголовок для скринридеров
        const titleElement = this.counterElement.closest('.sorting-hotels-title');
        if (titleElement) {
            const visuallyHidden = titleElement.querySelector('.visually-hidden');
            if (visuallyHidden) {
                visuallyHidden.textContent = `Найдено гостиниц: ${count}.`;
            }
        }

        console.log(`Счетчик обновлен: ${count} гостиниц`);
    }

// Настраивает наблюдатель за изменениями DOM
    setupMutationObserver() {
        if (typeof MutationObserver === 'undefined' || !this.hotelsContainer) return;

        this.observer = new MutationObserver((mutations) => {
            let needsUpdate = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
// Проверяем изменения в списке карточек
                    needsUpdate = true;
                    break;
                } else if (mutation.type === 'attributes' &&
                          (mutation.attributeName === 'style' ||
                           mutation.attributeName === 'class')) {
// Проверяем изменения стилей (могут скрывать/показывать карточки)
                    needsUpdate = true;
                    break;
                }
            }

            if (needsUpdate) {
// Используем debounce для оптимизации
                clearTimeout(this.updateTimeout);
                this.updateTimeout = setTimeout(() => this.update(), 100);
            }
        });

// Наблюдаем за изменениями в контейнере
        this.observer.observe(this.hotelsContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

// Настраивает обработчики событий для внешних изменений
    setupEventListeners() {
// Событие для ручного обновления счетчика
        window.addEventListener('hotels:updated', () => this.update());

// Событие при изменении фильтров (если есть)
        const filterElements = document.querySelectorAll('select, input[type="checkbox"], input[type="radio"]');
        filterElements.forEach(element => {
            element.addEventListener('change', () => {
                setTimeout(() => this.update(), 300); // Задержка для анимаций фильтрации
            });
        });
    }

// Получает текущее количество гостиниц
    getCount() {
        return parseInt(this.counterElement.textContent) || 0;
    }

// Уничтожает наблюдателя и очищает ресурсы
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        clearTimeout(this.updateTimeout);
    }
}

// Инициализация счетчика при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.hotelsCounter = new HotelsCounter();
});

// Экспорт для использования в других модулях (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HotelsCounter };
}

document.querySelector('.burger').addEventListener('click', function() {
  this.classList.toggle('active');
  document.querySelector('.navigation-list').classList.toggle('open');
})
