  // !!! открытие модального окна

// поиск кнопки открытия модалки
const modalOpenButton = document.querySelector('.search-button');
console.log(modalOpenButton);

// находим модальное окно
const modal = document.querySelector('.modal-container');
console.log(modal);

// поиск кнопки закрытия модалки
const modalCloseButton = document.querySelector('.modal-close-button');
console.log(modalCloseButton);

// отслеживаем клик по кнопке открытия
modalOpenButton.addEventListener('click', function () {
  console.log('click!!!');

// удаляем класс скрывающий модальное окно
modal.classList.remove('modal-container-close');
console.log('удалили класс!!!');
});

  // !!! закрытие модального окна

// отслеживаем клик по кнопке закрытия
modalCloseButton.addEventListener('click', function () {
  console.log('click!!!');

// добавляем класс скрывающий модальное окно
modal.classList.add('modal-container-close');
console.log('добавили класс!!!');
});

// закрываем модалку по ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    modal.classList.add('modal-container-close');
    console.log('Закрыли по ESC');
  }
});

// Закрытие по клику вне модального окна
modal.addEventListener('click', function(e) {
// Проверяем, что клик был именно на фон (на сам modal)
  if (e.target === this) {
    console.log('Клик вне модального окна');
    this.classList.add('modal-container-close');
  }
});

  // !!! выбор даты заезда

let arrivalDate = new Date();
let departureDate = new Date();
let currentCalendar = null; // Для отслеживания открытого календаря

document.addEventListener('DOMContentLoaded', function() {
  const arrivalInput = document.getElementById('search-date-arrival');
  const departureInput = document.getElementById('search-date-departure');

  if (!arrivalInput || !departureInput) return;

// Установка начальных дат
  departureDate.setDate(arrivalDate.getDate() + 1);

  arrivalInput.value = formatDate(arrivalDate);
  departureInput.value = formatDate(departureDate);

// Обработка стрелок
  setupArrowHandlers(arrivalInput, departureInput);

// Автоматическое преобразование форматов при потере фокуса
  setupAutoFormat(arrivalInput, departureInput);

// Добавляем функционал календаря
  setupCalendarIcons(arrivalInput, departureInput);
});

// Настройка кликабельных иконок календаря
function setupCalendarIcons(arrivalInput, departureInput) {
// Находим контейнеры с иконками
  const arrivalContainer = arrivalInput.closest('.container-field-modal');
  const departureContainer = departureInput.closest('.container-field-modal');

  if (!arrivalContainer || !departureContainer) return;

// Делаем контейнеры кликабельными
  arrivalContainer.style.cursor = 'pointer';
  departureContainer.style.cursor = 'pointer';

// Добавляем обработчики кликов на контейнеры
  arrivalContainer.addEventListener('click', function(e) {
// Проверяем, что клик не по самому инпуту
    if (e.target === arrivalInput) return;

    e.preventDefault();
    e.stopPropagation();
    openCalendar(arrivalInput, true, arrivalContainer);
  });

  departureContainer.addEventListener('click', function(e) {
    if (e.target === departureInput) return;

    e.preventDefault();
    e.stopPropagation();
    openCalendar(departureInput, false, departureContainer);
  });

// Закрываем календарь при клике вне его
  document.addEventListener('click', function(e) {
    if (currentCalendar && !currentCalendar.contains(e.target) &&
        !arrivalContainer.contains(e.target) && !departureContainer.contains(e.target)) {
      closeCalendar();
    }
  });

// Создаем стили для календаря
  addCalendarStyles();
}

// Функция открытия календаря
function openCalendar(inputElement, isArrival, containerElement) {
  // Закрываем предыдущий календарь если он открыт
  if (currentCalendar) {
    currentCalendar.remove();
  }

// Создаем контейнер календаря
  const calendar = document.createElement('div');
  calendar.className = 'custom-datepicker';
  calendar.style.position = 'absolute';
  calendar.style.backgroundColor = 'white';
  calendar.style.border = '2px solid #83B3D3';
  calendar.style.borderRadius = '4px';
  calendar.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
  calendar.style.padding = '20px';
  calendar.style.zIndex = '1000';
  calendar.style.fontFamily = '"PT Sans", sans-serif';
  calendar.style.width = '300px';
  calendar.style.boxSizing = 'border-box';
  calendar.style.animation = 'fadeIn 0.2s ease-out';

// Позиционируем календарь
  const rect = containerElement.getBoundingClientRect();
  calendar.style.left = Math.min(rect.left, window.innerWidth - 320) + 'px';
  calendar.style.top = (rect.bottom + window.scrollY + 8) + 'px';

// Создаем переменную для текущего отображаемого месяца
  const displayDate = isArrival ? new Date(arrivalDate) : new Date(departureDate);

// Функция для отрисовки календаря с указанной датой
  function renderCalendar(targetDate) {
// Очищаем содержимое календаря
    calendar.innerHTML = '';

// Создаем заголовок календаря с стрелками навигации
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '16px';
    header.style.fontWeight = '700';
    header.style.fontSize = '18px';
    header.style.color = '#000000';

// Стрелка "назад"
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4L6 8L10 12" stroke="#83B3D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    prevButton.style.background = 'none';
    prevButton.style.border = 'none';
    prevButton.style.cursor = 'pointer';
    prevButton.style.width = '32px';
    prevButton.style.height = '32px';
    prevButton.style.display = 'flex';
    prevButton.style.alignItems = 'center';
    prevButton.style.justifyContent = 'center';
    prevButton.style.borderRadius = '4px';
    prevButton.style.transition = 'all 0.2s';
    prevButton.title = 'Предыдущий месяц';

// Название месяца и года с центрированием
    const monthYear = document.createElement('div');
    monthYear.style.display = 'flex';
    monthYear.style.alignItems = 'center';
    monthYear.style.gap = '8px';
    monthYear.style.flex = '1';
    monthYear.style.justifyContent = 'center';

    const monthSpan = document.createElement('span');
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    monthSpan.textContent = months[targetDate.getMonth()];
    monthSpan.style.fontSize = '18px';

    const yearSpan = document.createElement('span');
    yearSpan.textContent = targetDate.getFullYear();
    yearSpan.style.fontSize = '16px';
    yearSpan.style.color = '#666';

    monthYear.appendChild(monthSpan);
    monthYear.appendChild(yearSpan);

// Стрелка "вперед"
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L10 8L6 12" stroke="#83B3D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    nextButton.style.background = 'none';
    nextButton.style.border = 'none';
    nextButton.style.cursor = 'pointer';
    nextButton.style.width = '32px';
    nextButton.style.height = '32px';
    nextButton.style.display = 'flex';
    nextButton.style.alignItems = 'center';
    nextButton.style.justifyContent = 'center';
    nextButton.style.borderRadius = '4px';
    nextButton.style.transition = 'all 0.2s';
    nextButton.title = 'Следующий месяц';

// Эффекты при наведении на стрелки
    [prevButton, nextButton].forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#f2f2f2';
      });
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '';
      });

      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
      });

      button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
      });
    });

// Обработчики для стрелок
    prevButton.addEventListener('click', function(e) {
      e.stopPropagation();
      targetDate.setMonth(targetDate.getMonth() - 1);
      renderCalendar(new Date(targetDate));
    });

    nextButton.addEventListener('click', function(e) {
      e.stopPropagation();
      targetDate.setMonth(targetDate.getMonth() + 1);
      renderCalendar(new Date(targetDate));
    });

// Добавляем элементы в заголовок
    header.appendChild(prevButton);
    header.appendChild(monthYear);
    header.appendChild(nextButton);
    calendar.appendChild(header);

// Создаем дни недели
    const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    const weekdaysRow = document.createElement('div');
    weekdaysRow.style.display = 'flex';
    weekdaysRow.style.marginBottom = '12px';
    weekdaysRow.style.fontWeight = '700';

    weekdays.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.textContent = day;
      dayElement.style.flex = '1';
      dayElement.style.textAlign = 'center';
      dayElement.style.fontSize = '14px';
      dayElement.style.color = '#666';
      dayElement.style.textTransform = 'uppercase';
      dayElement.style.letterSpacing = '0.5px';
      weekdaysRow.appendChild(dayElement);
    });

    calendar.appendChild(weekdaysRow);

// Создаем сетку календаря
    const grid = document.createElement('div');
    grid.style.display = 'flex';
    grid.style.flexWrap = 'wrap';
    grid.style.gap = '4px';

// Получаем первый день месяца и количество дней в месяце
    const firstDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

// Получаем день недели первого дня
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Воскресенье становится 7

// Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 1; i < firstDayOfWeek; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.style.flex = '1 0 calc((100% - 24px) / 7)';
      emptyCell.style.height = '36px';
      emptyCell.style.textAlign = 'center';
      emptyCell.style.lineHeight = '36px';
      emptyCell.style.fontSize = '16px';
      emptyCell.style.color = '#E5E5E5';
      emptyCell.style.cursor = 'default';
      grid.appendChild(emptyCell);
    }

// Добавляем дни текущего месяца
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.textContent = day;
      dayElement.style.flex = '1 0 calc((100% - 24px) / 7)';
      dayElement.style.height = '36px';
      dayElement.style.textAlign = 'center';
      dayElement.style.lineHeight = '36px';
      dayElement.style.cursor = 'pointer';
      dayElement.style.borderRadius = '4px';
      dayElement.style.fontSize = '16px';
      dayElement.style.fontWeight = '700';
      dayElement.style.transition = 'all 0.2s';

// Создаем дату для этого дня
      const cellDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), day);

// Проверяем, является ли дата сегодняшним днем
      if (cellDate.getTime() === today.getTime()) {
        dayElement.style.border = '2px solid #83B3D3';
        dayElement.style.color = '#83B3D3';
      }

// Проверяем, является ли дата выбранной
      const isSelected = isArrival ? cellDate.getTime() === arrivalDate.getTime() :
                                     cellDate.getTime() === departureDate.getTime();

      if (isSelected) {
        dayElement.style.backgroundColor = '#83B3D3';
        dayElement.style.color = '#ffffff';
        dayElement.style.fontWeight = '800';
      }

// Проверяем доступность даты
      const minDate = isArrival ? today : new Date(arrivalDate);
      minDate.setDate(minDate.getDate() + (isArrival ? 0 : 1));

      if (cellDate < minDate) {
        dayElement.style.color = '#E5E5E5';
        dayElement.style.cursor = 'not-allowed';
        dayElement.style.textDecoration = 'line-through';
      } else {
        dayElement.addEventListener('click', function() {
          if (cellDate >= minDate) {
            if (isArrival) {
              arrivalDate = cellDate;
              inputElement.value = formatDate(arrivalDate);
              updateDepartureMinDate();
            } else {
              departureDate = cellDate;
              inputElement.value = formatDate(departureDate);
            }
            closeCalendar();

// Триггерим событие изменения
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });

// Эффект при наведении
        dayElement.addEventListener('mouseenter', function() {
          if (cellDate >= minDate && !isSelected) {
            this.style.backgroundColor = '#f2f2f2';
            this.style.color = '#000000';
          }
        });

        dayElement.addEventListener('mouseleave', function() {
          if (cellDate >= minDate && !isSelected) {
            this.style.backgroundColor = '';
            this.style.color = cellDate.getTime() === today.getTime() ? '#83B3D3' : '#000000';
          }
        });
      }

      grid.appendChild(dayElement);
    }

    calendar.appendChild(grid);

// Добавляем кнопки быстрого выбора
    const quickSelect = document.createElement('div');
    quickSelect.style.marginTop = '20px';
    quickSelect.style.display = 'flex';
    quickSelect.style.gap = '12px';
    quickSelect.style.paddingTop = '16px';
    quickSelect.style.borderTop = '2px solid #f2f2f2';

    const quickToday = document.createElement('button');
    quickToday.textContent = 'Сегодня';
    quickToday.style.flex = '1';
    quickToday.style.padding = '10px';
    quickToday.style.border = '2px solid #83B3D3';
    quickToday.style.borderRadius = '4px';
    quickToday.style.background = 'white';
    quickToday.style.cursor = 'pointer';
    quickToday.style.fontSize = '16px';
    quickToday.style.fontWeight = '700';
    quickToday.style.color = '#83B3D3';
    quickToday.style.transition = 'all 0.2s';

    const quickTomorrow = document.createElement('button');
    quickTomorrow.textContent = 'Завтра';
    quickTomorrow.style.flex = '1';
    quickTomorrow.style.padding = '10px';
    quickTomorrow.style.border = '2px solid #83B3D3';
    quickTomorrow.style.borderRadius = '4px';
    quickTomorrow.style.background = 'white';
    quickTomorrow.style.cursor = 'pointer';
    quickTomorrow.style.fontSize = '16px';
    quickTomorrow.style.fontWeight = '700';
    quickTomorrow.style.color = '#83B3D3';
    quickTomorrow.style.transition = 'all 0.2s';

// Эффекты для кнопок быстрого выбора
    [quickToday, quickTomorrow].forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#83B3D3';
        button.style.color = 'white';
      });
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'white';
        button.style.color = '#83B3D3';
      });

      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.98)';
      });

      button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
      });
    });

    quickToday.addEventListener('click', function() {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if (isArrival) {
        arrivalDate = todayDate;
        inputElement.value = formatDate(arrivalDate);
        updateDepartureMinDate();
      } else {
        const minDate = new Date(arrivalDate);
        minDate.setDate(minDate.getDate() + 1);

        if (todayDate >= minDate) {
          departureDate = todayDate;
          inputElement.value = formatDate(departureDate);
        } else {
          departureDate = minDate;
          inputElement.value = formatDate(departureDate);
        }
      }
      closeCalendar();
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    });

    quickTomorrow.addEventListener('click', function() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      if (isArrival) {
        arrivalDate = tomorrow;
        inputElement.value = formatDate(arrivalDate);
        updateDepartureMinDate();
      } else {
        const minDate = new Date(arrivalDate);
        minDate.setDate(minDate.getDate() + 1);

        if (tomorrow >= minDate) {
          departureDate = tomorrow;
          inputElement.value = formatDate(departureDate);
        } else {
          departureDate = minDate;
          inputElement.value = formatDate(departureDate);
        }
      }
      closeCalendar();
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    });

    quickSelect.appendChild(quickToday);
    quickSelect.appendChild(quickTomorrow);
    calendar.appendChild(quickSelect);
  }

// Начинаем отрисовку с текущей даты
  renderCalendar(displayDate);

// Предотвращаем закрытие при клике внутри календаря
  calendar.addEventListener('click', function(e) {
    e.stopPropagation();
  });

// Добавляем календарь на страницу
  document.body.appendChild(calendar);
  currentCalendar = calendar;

// Закрываем календарь при нажатии Escape
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      closeCalendar();
      document.removeEventListener('keydown', closeOnEscape);
    }
  }, { once: true });
}

// Функция закрытия календаря
function closeCalendar() {
  if (currentCalendar) {
    currentCalendar.remove();
    currentCalendar = null;
  }
}

// Добавляем стили для календаря
function addCalendarStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .custom-datepicker {
      animation: fadeIn 0.2s ease-out;
    }

    .custom-datepicker button:focus {
      outline: 3px solid #83B3D3;
      outline-offset: 2px;
    }

    .custom-datepicker button:active {
      opacity: 0.7;
    }

    .custom-datepicker svg {
      transition: transform 0.2s;
    }

    .custom-datepicker button:hover svg {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
}

function setupArrowHandlers(arrivalInput, departureInput) {
  arrivalInput.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const delta = e.key === 'ArrowUp' ? 1 : -1;
      arrivalDate.setDate(arrivalDate.getDate() + delta);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (arrivalDate >= today) {
        arrivalInput.value = formatDate(arrivalDate);
        updateDepartureMinDate();
      } else {
        arrivalDate.setDate(arrivalDate.getDate() - delta);
      }
    }
  });

  departureInput.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const delta = e.key === 'ArrowUp' ? 1 : -1;
      departureDate.setDate(departureDate.getDate() + delta);

      const minDate = new Date(arrivalDate);
      minDate.setDate(minDate.getDate() + 1);

      if (departureDate >= minDate) {
        departureInput.value = formatDate(departureDate);
      } else {
        departureDate = minDate;
        departureInput.value = formatDate(departureDate);
      }
    }
  });
}

function setupAutoFormat(arrivalInput, departureInput) {
// Функция преобразования формата
  function autoFormat(input, isArrival) {
    const value = input.value.trim();
    if (!value) return;

    const parsedDate = smartParseDate(value);
    if (!parsedDate) {
// Если не удалось распарсить, восстанавливаем предыдущее значение
      input.value = isArrival ? formatDate(arrivalDate) : formatDate(departureDate);
      return;
    }

// Валидация
    if (isArrival) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (parsedDate >= today) {
        arrivalDate = parsedDate;
        input.value = formatDate(arrivalDate);
        updateDepartureMinDate();
      } else {
        input.value = formatDate(arrivalDate);
      }
    } else {
      const minDate = new Date(arrivalDate);
      minDate.setDate(minDate.getDate() + 1);

      if (parsedDate >= minDate) {
        departureDate = parsedDate;
        input.value = formatDate(departureDate);
      } else {
        departureDate = minDate;
        input.value = formatDate(departureDate);
      }
    }
  }

// Вешаем обработчики
  arrivalInput.addEventListener('blur', () => autoFormat(arrivalInput, true));
  departureInput.addEventListener('blur', () => autoFormat(departureInput, false));
  arrivalInput.addEventListener('change', () => autoFormat(arrivalInput, true));
  departureInput.addEventListener('change', () => autoFormat(departureInput, false));
}

// Умный парсинг даты
function smartParseDate(str) {
  str = str.trim();

// Попробуем популярные форматы
  const formats = [
// 22.12.2025, 22/12/2025, 22-12-2025
    /^(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{4})$/,
// 2025-12-22
    /^(\d{4})[\.\/\-](\d{1,2})[\.\/\-](\d{1,2})$/,
// 22 декабря 2025
    /^(\d{1,2})\s+([а-яА-ЯёЁ]+)\s+(\d{4})\s*(г\.)?$/,
// December 22, 2025
    /^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})$/
  ];

  for (let format of formats) {
    const match = str.match(format);
    if (match) {
      let day, month, year;

      if (format === formats[0]) {
// 22.12.2025
        day = parseInt(match[1]);
        month = parseInt(match[2]) - 1;
        year = parseInt(match[3]);
      } else if (format === formats[1]) {
// 2025-12-22
        year = parseInt(match[1]);
        month = parseInt(match[2]) - 1;
        day = parseInt(match[3]);
      } else if (format === formats[2]) {
// 22 декабря 2025
        day = parseInt(match[1]);
        const monthName = match[2].toLowerCase();
        year = parseInt(match[3]);

        const months = {
          'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3,
          'мая': 4, 'июня': 5, 'июля': 6, 'августа': 7,
          'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
        };

        month = months[monthName];
        if (month === undefined) continue;
      } else if (format === formats[3]) {
// December 22, 2025
        const monthName = match[1].toLowerCase();
        day = parseInt(match[2]);
        year = parseInt(match[3]);

        const engMonths = {
          'january': 0, 'february': 1, 'march': 2, 'april': 3,
          'may': 4, 'june': 5, 'july': 6, 'august': 7,
          'september': 8, 'october': 9, 'november': 10, 'december': 11,
          'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
          'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };

        month = engMonths[monthName];
        if (month === undefined) continue;
      }

      const date = new Date(year, month, day);
      if (!isNaN(date.getTime()) && date.getDate() === day) {
        return date;
      }
    }
  }

// Если не нашли подходящий формат, пробуем Date.parse
  const date = new Date(str);
  return !isNaN(date.getTime()) ? date : null;
}

function updateDepartureMinDate() {
  const minDate = new Date(arrivalDate);
  minDate.setDate(minDate.getDate() + 1);

  if (departureDate < minDate) {
    departureDate = minDate;
    const departureInput = document.getElementById('search-date-departure');
    if (departureInput) {
      departureInput.value = formatDate(departureDate);
    }
  }
}

function formatDate(date) {
  const months = [
    'января', 'февраля', 'марта', 'апреля',
    'мая', 'июня', 'июля', 'августа',
    'сентября', 'октября', 'ноября', 'декабря'
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

  // !!! уменьшение-увеличение количества взрослых и детей

// находим кнопки уменьшения, увеличения
const decreaseButtons = document.querySelectorAll('.decrease');
console.log(decreaseButtons);

const increaseButtons = document.querySelectorAll('.increase');
console.log(increaseButtons);

// находим кнопки значения input
const visitorInput = document.getElementById('quantity-visitor');
const childrenInput = document.getElementById('quantity-children');

// устанавливаем максимальное общее количество посетителей
const MAX_TOTAL = 100;

// Функция для получения текущего общего количества посетителей
function getTotalVisitors() {
  const visitorValue = parseInt(visitorInput.value) || 0;
  const childrenValue = parseInt(childrenInput.value) || 0;
  return visitorValue + childrenValue;
}

// Функция для проверки значений
function validateInputs() {
  let hasError = false;

// Проверяем общий лимит
  const currentTotal = getTotalVisitors();

  if (currentTotal > MAX_TOTAL) {
    console.log(`Превышен лимит! ${currentTotal} > ${MAX_TOTAL}`);
    hasError = true;

// Показываем сообщение пользователю
    alert(`Максимальное количество посетителей: ${MAX_TOTAL}. Текущее: ${currentTotal}`);
  }

// Проверяем минимальные значения
  const visitorMin = parseInt(visitorInput.min) || 1;
  if ((parseInt(visitorInput.value) || 0) < visitorMin) {
    console.log(`Количество взрослых меньше минимума: ${visitorMin}`);
    hasError = true;
  }

  const childrenMin = parseInt(childrenInput.min) || 0;
  if ((parseInt(childrenInput.value) || 0) < childrenMin) {
    console.log(`Количество детей меньше минимума: ${childrenMin}`);
    hasError = true;
  }

  return hasError;
}

// Функция для проверки, можно ли увеличить конкретное поле
function canIncrease(input) {
  const currentValue = parseInt(input.value) || 0;
  const fieldMax = input.hasAttribute('max') ? parseInt(input.max) : Infinity;
  const currentTotal = getTotalVisitors();

// Проверяем два условия:
// 1. Не превышен лимит самого поля
// 2. Не превышен общий лимит
  return currentValue < fieldMax && currentTotal < MAX_TOTAL;
}

// Выводим начальное значение
const initialTotal = getTotalVisitors();
console.log('Начальное количество:', initialTotal);
console.log('Максимум:', MAX_TOTAL);

// уменьшаем количество посетителей
// отслеживаем клик по кнопке - уменьшения
decreaseButtons.forEach(function(button) {
  button.addEventListener('click', function () {
    console.log('Клик по кнопке "-"');

// Находим ближайший контейнер .container-quantity
    const container = this.closest('.container-quantity');
    if (!container) return;

// Находим input внутри этого контейнера
    const input = container.querySelector('input[type="number"]');
    if (!input) return;

// Получаем текущее значение
    let currentValue = parseInt(input.value);
    const minValue = parseInt(input.min);

// Уменьшаем, но не ниже min
    if (currentValue > minValue) {
      currentValue--;
      input.value = currentValue;
      console.log(`Уменьшили ${input.id} до ${currentValue}`);

// Вызываем событие change для обновления формы
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
});

// увеличиваем количество посетителей
// отслеживаем клик по кнопке + увеличения
increaseButtons.forEach(function(button) {
  button.addEventListener('click', function () {
    console.log('Клик по кнопке "+"');

// Находим ближайший контейнер .container-quantity
    const container = this.closest('.container-quantity');
    if (!container) return;

// Находим input внутри этого контейнера
    const input = container.querySelector('input[type="number"]');
    if (!input) return;

// Проверяем, можно ли увеличить
    if (canIncrease(input)) {
      let currentValue = parseInt(input.value) || 0;
      currentValue++;
      input.value = currentValue;
      console.log(`Увеличили ${input.id} до ${currentValue}`);
      console.log(`Новое общее количество: ${getTotalVisitors()}/${MAX_TOTAL}`);

// Вызываем событие change для обновления формы
      input.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      const currentTotal = getTotalVisitors();
      if (currentTotal >= MAX_TOTAL) {
        console.log(`Нельзя увеличить: достигнут общий лимит ${MAX_TOTAL}`);
        alert(`Максимальное количество посетителей: ${MAX_TOTAL}`);
      }
    }
  });
});

// Запрещаем изменение через стрелки input и клавиатуру
[visitorInput, childrenInput].forEach(input => {
// Отключаем встроенные стрелки (для некоторых браузеров)
  input.addEventListener('wheel', function(e) {
    e.preventDefault();
  });

// Отслеживаем изменение через стрелки input'а
  input.addEventListener('input', function(e) {
// Если значение изменилось не через наши кнопки
    const newValue = parseInt(this.value) || 0;
    const oldValue = this._lastValue || newValue;

// Проверяем, было ли увеличение
    if (newValue > oldValue) {
// Проверяем, можно ли увеличить
      if (!canIncrease(this)) {
// Отменяем увеличение - возвращаем старое значение
        this.value = oldValue;
        console.log(`Запрещено увеличение через стрелки/клавиатуру: ${this.id}`);

        if (getTotalVisitors() >= MAX_TOTAL) {
          alert(`Максимальное количество посетителей: ${MAX_TOTAL}`);
        }
      }
    }

// Сохраняем текущее значение для следующей проверки
    this._lastValue = newValue;
  });

// Обработка клавиш вверх/вниз
  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();

      const delta = e.key === 'ArrowUp' ? 1 : -1;

      if (delta > 0) {
// Проверяем, можно ли увеличить
        if (!canIncrease(this)) {
          console.log(`Запрещено увеличение через клавишу ${event.key}: ${this.id}`);

          if (getTotalVisitors() >= MAX_TOTAL) {
            alert(`Максимальное количество посетителей: ${MAX_TOTAL}`);
          }
          return;
        }
      }

// Разрешаем изменение через стрелки, если проверка пройдена
      let currentValue = parseInt(this.value) || 0;
      const minValue = parseInt(this.min) || 0;

      if (delta > 0 && canIncrease(this)) {
        currentValue++;
      } else if (delta < 0 && currentValue > minValue) {
        currentValue--;
      }

      this.value = currentValue;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

// Инициализируем последнее значение
  input._lastValue = parseInt(input.value) || 0;
});

// Валидация при ручном вводе числа
visitorInput.addEventListener('change', function() {
  console.log('Ручной ввод в поле взрослых:', this.value);

// Проверяем общий лимит
  const currentTotal = getTotalVisitors();

  if (currentTotal > MAX_TOTAL) {
// Не даем сохранить значение, превышающее лимит
// Установка максимально допустимого
    const otherInput = this.id === 'quantity-visitor' ? childrenInput : visitorInput;
    const otherValue = parseInt(otherInput.value) || 0;
    const maxAllowed = MAX_TOTAL - otherValue;
    const minValue = parseInt(this.min) || 0;

    this.value = Math.max(minValue, Math.min(parseInt(this.value) || 0, maxAllowed));

    console.log(`Скорректировано ${this.id} до ${this.value} (максимально допустимое: ${maxAllowed})`);
    alert(`Максимальное количество посетителей: ${MAX_TOTAL}. Установлено ${this.value}`);
  }

// Сохраняем валидное значение
  this._lastValidValue = this.value;

// Общая проверка
  const hasError = validateInputs();
  if (hasError) {
    console.log('Обнаружены ошибки при ручном вводе');
  }
});

childrenInput.addEventListener('change', function() {
  console.log('Ручной ввод в поле детей:', this.value);

// Проверяем общий лимит
  const currentTotal = getTotalVisitors();

  if (currentTotal > MAX_TOTAL) {
// Установка максимально допустимого
    const otherInput = this.id === 'quantity-visitor' ? childrenInput : visitorInput;
    const otherValue = parseInt(otherInput.value) || 0;
    const maxAllowed = MAX_TOTAL - otherValue;
    const minValue = parseInt(this.min) || 0;

    this.value = Math.max(minValue, Math.min(parseInt(this.value) || 0, maxAllowed));

    console.log(`Скорректировано ${this.id} до ${this.value} (максимально допустимое: ${maxAllowed})`);
    alert(`Максимальное количество посетителей: ${MAX_TOTAL}. Установлено ${this.value}`);
  }

// Сохраняем валидное значение
  this._lastValidValue = this.value;

// Общая проверка
  const hasError = validateInputs();
  if (hasError) {
    console.log('Обнаружены ошибки при ручном вводе');
  }
});

// Запрет ввода нечисловых значений
[visitorInput, childrenInput].forEach(input => {
  input.addEventListener('keypress', function(e) {
// Разрешаем только цифры и управляющие клавиши
    const charCode = e.which ? e.which : e.keyCode;

// Разрешаем: цифры 0-9, Backspace, Tab, стрелки
    if (
      (charCode < 48 || charCode > 57) && // не цифра
      charCode !== 8 &&  // не Backspace
      charCode !== 9 &&  // не Tab
      charCode !== 37 && // не стрелка влево
      charCode !== 39    // не стрелка вправо
    ) {
      e.preventDefault();
      console.log('Ввод запрещен: разрешены только цифры');
    }
  });

// Обработка вставки (paste)
  input.addEventListener('paste', function(e) {
    const pastedText = e.clipboardData.getData('text');

// Проверяем, что вставлено число
    if (!/^\d+$/.test(pastedText)) {
      e.preventDefault();
      console.log('Вставка запрещена: можно вставлять только цифры');
      alert('Можно вставлять только цифры');
    }
  });
});

// Проверка при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log('Проверка начальных значений...');

// Сохраняем начальные значения как валидные
  visitorInput._lastValidValue = visitorInput.value;
  childrenInput._lastValidValue = childrenInput.value;

// Только проверка
  const hasError = validateInputs();

  if (hasError) {
    console.log('Обнаружены ошибки в начальных значениях');
  }
});
