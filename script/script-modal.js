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
let departureDate = new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000);
let currentCalendar = null;

document.addEventListener('DOMContentLoaded', function() {
  const arrivalInput = document.getElementById('search-date-arrival');
  const departureInput = document.getElementById('search-date-departure');

  if (!arrivalInput || !departureInput) return;

// Установка начальных дат и блокировка ввода
  arrivalInput.value = formatDate(arrivalDate);
  departureInput.value = formatDate(departureDate);

  [arrivalInput, departureInput].forEach(input => {
    input.readOnly = true;
    input.style.cursor = 'pointer';
    input.addEventListener('keydown', e => e.preventDefault());
  });

  setupCalendarIcons(arrivalInput, departureInput);
});

function setupCalendarIcons(arrivalInput, departureInput) {
  const arrivalContainer = arrivalInput.closest('.container-field-modal');
  const departureContainer = departureInput.closest('.container-field-modal');

  if (!arrivalContainer || !departureContainer) return;

// Добавляем обработчики кликов
  const addCalendarHandler = (input, isArrival, container) => {
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCalendar(input, isArrival, container);
    };
    input.addEventListener('click', handler);
    container.addEventListener('click', handler);
    container.style.cursor = 'pointer';
  };

  addCalendarHandler(arrivalInput, true, arrivalContainer);
  addCalendarHandler(departureInput, false, departureContainer);

// Закрытие календаря при клике вне его
  document.addEventListener('click', (e) => {
    if (currentCalendar && !currentCalendar.contains(e.target) &&
        !arrivalContainer.contains(e.target) && !departureContainer.contains(e.target)) {
      closeCalendar();
    }
  });

  addCalendarStyles();
}

// Закрыть предыдущий календарь

function openCalendar(inputElement, isArrival, containerElement) {
  closeCalendar();

  const calendar = createCalendarElement(containerElement);
  const displayDate = isArrival ? new Date(arrivalDate) : new Date(departureDate);

  renderCalendar(calendar, displayDate, inputElement, isArrival);

  calendar.addEventListener('click', (e) => e.stopPropagation());
  document.body.appendChild(calendar);
  currentCalendar = calendar;

// Закрытие по Escape
  const closeOnEscape = (e) => e.key === 'Escape' && closeCalendar();
  document.addEventListener('keydown', closeOnEscape, { once: true });
}

function createCalendarElement(containerElement) {
  const calendar = document.createElement('div');
  calendar.className = 'custom-datepicker';
  calendar.style.cssText = `
    position: absolute;
    background-color: white;
    border: 2px solid #83B3D3;
    border-radius: 4px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    padding: 20px;
    z-index: 1000;
    font-family: "PT Sans", sans-serif;
    width: 300px;
    box-sizing: border-box;
    animation: fadeIn 0.2s ease-out;
  `;

  const rect = containerElement.getBoundingClientRect();
  calendar.style.left = Math.min(rect.left, window.innerWidth - 320) + 'px';
  calendar.style.top = (rect.bottom + window.scrollY + 8) + 'px';

  return calendar;
}

function renderCalendar(calendar, targetDate, inputElement, isArrival) {
  calendar.innerHTML = '';

// Создаем заголовок
  const header = createCalendarHeader(targetDate, (newDate) => renderCalendar(calendar, newDate, inputElement, isArrival));
  calendar.appendChild(header);

// Дни недели
  calendar.appendChild(createWeekdaysRow());

// Сетка дней
  const grid = createDaysGrid(targetDate, inputElement, isArrival);
  calendar.appendChild(grid);

// Кнопки быстрого выбора
  calendar.appendChild(createQuickSelectButtons(inputElement, isArrival));
}

function createCalendarHeader(targetDate, onDateChange) {
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-weight: 700;
    font-size: 18px;
    color: #000000;
  `;

  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

 // Стрелка назад
  const prevButton = createNavButton('<', 'Предыдущий месяц', () => {
    targetDate.setMonth(targetDate.getMonth() - 1);
    onDateChange(new Date(targetDate));
  });

// Название месяца и года
  const monthYear = document.createElement('div');
  monthYear.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
  `;

  const monthSpan = document.createElement('span');
  monthSpan.textContent = months[targetDate.getMonth()];
  monthSpan.style.fontSize = '18px';

  const yearSpan = document.createElement('span');
  yearSpan.textContent = targetDate.getFullYear();
  yearSpan.style.cssText = 'font-size: 16px; color: #666;';

  monthYear.appendChild(monthSpan);
  monthYear.appendChild(yearSpan);

// Стрелка вперед
  const nextButton = createNavButton('>', 'Следующий месяц', () => {
    targetDate.setMonth(targetDate.getMonth() + 1);
    onDateChange(new Date(targetDate));
  });

  header.appendChild(prevButton);
  header.appendChild(monthYear);
  header.appendChild(nextButton);

  return header;
}

function createNavButton(text, title, onClick) {
  const button = document.createElement('button');
  button.innerHTML = text === '<' ?
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4L6 8L10 12" stroke="#83B3D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L10 8L6 12" stroke="#83B3D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  button.title = title;
  button.style.cssText = `
    background: none;
    border: none;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  `;

  button.addEventListener('mouseenter', () => button.style.backgroundColor = '#f2f2f2');
  button.addEventListener('mouseleave', () => button.style.backgroundColor = '');
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });

  return button;
}

function createWeekdaysRow() {
  const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const row = document.createElement('div');
  row.style.cssText = `
    display: flex;
    margin-bottom: 12px;
    font-weight: 700;
  `;

  weekdays.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.textContent = day;
    dayElement.style.cssText = `
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;
    row.appendChild(dayElement);
  });

  return row;
}

function createDaysGrid(targetDate, inputElement, isArrival) {
  const grid = document.createElement('div');
  grid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px;';

  const firstDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  const lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  let firstDayOfWeek = firstDay.getDay();
  if (firstDayOfWeek === 0) firstDayOfWeek = 7;

// Пустые ячейки
  for (let i = 1; i < firstDayOfWeek; i++) {
    grid.appendChild(createEmptyDayCell());
  }

// Дни месяца
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), day);
    grid.appendChild(createDayCell(cellDate, today, inputElement, isArrival));
  }

  return grid;
}

function createEmptyDayCell() {
  const cell = document.createElement('div');
  cell.style.cssText = `
    flex: 1 0 calc((100% - 24px) / 7);
    height: 36px;
    text-align: center;
    line-height: 36px;
    font-size: 16px;
    color: #E5E5E5;
    cursor: default;
  `;
  return cell;
}

function createDayCell(cellDate, today, inputElement, isArrival) {
  const cell = document.createElement('div');
  cell.textContent = cellDate.getDate();
  cell.style.cssText = `
    flex: 1 0 calc((100% - 24px) / 7);
    height: 36px;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 700;
    transition: all 0.2s;
  `;

// Сегодняшний день
  if (cellDate.getTime() === today.getTime()) {
    cell.style.border = '2px solid #83B3D3';
    cell.style.color = '#83B3D3';
  }

// Выбранный день
  const selectedDate = isArrival ? arrivalDate : departureDate;
  const isSelected = cellDate.getTime() === selectedDate.getTime();

  if (isSelected) {
    cell.style.backgroundColor = '#83B3D3';
    cell.style.color = '#ffffff';
    cell.style.fontWeight = '800';
  }

// Проверка доступности
  const minDate = isArrival ? today : new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000);

  if (cellDate < minDate) {
    cell.style.color = '#E5E5E5';
    cell.style.cursor = 'not-allowed';
    cell.style.textDecoration = 'line-through';
  } else {
    cell.addEventListener('click', () => selectDate(cellDate, inputElement, isArrival));

    cell.addEventListener('mouseenter', () => {
      if (!isSelected) {
        cell.style.backgroundColor = '#f2f2f2';
        cell.style.color = '#000000';
      }
    });

    cell.addEventListener('mouseleave', () => {
      if (!isSelected) {
        cell.style.backgroundColor = '';
        cell.style.color = cellDate.getTime() === today.getTime() ? '#83B3D3' : '#000000';
      }
    });
  }

  return cell;
}

function selectDate(date, inputElement, isArrival) {
  if (isArrival) {
    arrivalDate = date;
    updateDepartureMinDate();
  } else {
    departureDate = date;
  }

  inputElement.value = formatDate(isArrival ? arrivalDate : departureDate);
  closeCalendar();
  inputElement.dispatchEvent(new Event('change', { bubbles: true }));
}

function createQuickSelectButtons(inputElement, isArrival) {
  const container = document.createElement('div');
  container.style.cssText = `
    margin-top: 20px;
    display: flex;
    gap: 12px;
    padding-top: 16px;
    border-top: 2px solid #f2f2f2;
  `;

  const createQuickButton = (text, getDateFn) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      flex: 1;
      padding: 10px;
      border: 2px solid #83B3D3;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 16px;
      font-weight: 700;
      color: #83B3D3;
      transition: all 0.2s;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#83B3D3';
      button.style.color = 'white';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'white';
      button.style.color = '#83B3D3';
    });

    button.addEventListener('click', () => {
      const date = getDateFn();
      if (isArrival || date >= new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000)) {
        selectDate(date, inputElement, isArrival);
      }
    });

    return button;
  };

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(todayDate.getTime() + 24 * 60 * 60 * 1000);

  container.appendChild(createQuickButton('Сегодня', () => todayDate));
  container.appendChild(createQuickButton('Завтра', () => tomorrowDate));

  return container;
}

function closeCalendar() {
  if (currentCalendar) {
    currentCalendar.remove();
    currentCalendar = null;
  }
}

function addCalendarStyles() {
  if (document.querySelector('#calendar-styles')) return;

  const style = document.createElement('style');
  style.id = 'calendar-styles';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
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
  `;
  document.head.appendChild(style);
}

function updateDepartureMinDate() {
  const minDate = new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000);

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
