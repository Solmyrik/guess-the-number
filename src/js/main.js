import { optionsAnswers, optionsHint } from './options';
import { state } from './state';

// получаем элементы из DOM
const button = document.querySelector('.main__button');
const input = document.querySelector('.main__input');

const buttonSetting = document.querySelector('.main__setting');
const exitSetting = document.querySelector('.setting__exit');
const setting = document.querySelector('.setting');

const restartButton = document.querySelector('.main__restart');

const minInput = document.querySelector('#min');
const maxInput = document.querySelector('#max');

// функция, которая получает рандомное число в диапазоне
function getRandomNumber(min, max) {
  const range = max - min;
  const currentRandom = Math.round(Math.random() * range) + Number(min);

  console.log(currentRandom);
  return currentRandom;
}

// при первом запуске получаем начальное рандомное число
state.currentNumber = getRandomNumber(1, 100);

// навешиваем обработчик событий на кнопку
button.addEventListener('click', (e) => {
  e.preventDefault();
  const currentValue = input.value;

  // запускаем ошибку при вводе некорректного числа
  console.log(currentValue, 'value');
  if (
    Number(currentValue) < state.minNumber ||
    Number(currentValue) > state.maxNumber ||
    currentValue[0] == '0'
  ) {
    showError();
    return;
  }

  // выводим текст в зависимости от того, число больше/меньше/равно
  if (currentValue > state.currentNumber) {
    state.textAnswers = optionsAnswers.more;
  }

  if (currentValue < state.currentNumber) {
    state.textAnswers = optionsAnswers.less;
  }

  if (currentValue == state.currentNumber) {
    state.textAnswers = `${optionsAnswers.equal} Попыток потребовалось: ${state.quantity + 1}`;
    button.classList.add('disabled');
  }

  // инкрементируем счетчик попыток
  state.quantity++;

  // запускаем функцию обновления состояний текст
  updateStates();
});

// функция, которая обновленяет текстовые блоки
function updateStates() {
  const textBlock = document.querySelector('.main__text');

  textBlock.textContent = state.textAnswers;

  if (state.quantity % 3 === 0) {
    showHint(true);
  }

  if (state.quantity % 3 === 1) {
    showHint(false);
  }
}

// функция, которая выводит alert с ошибкой
function showError() {
  alert(`Введите число в необходимом диапазоне от ${state.minNumber} до ${state.maxNumber}`);
}

// фукнция для вывода или удаления подсказки
// зависит от флага
function showHint(flag) {
  const hint = document.querySelector('.main__hint');
  const stateNumber = state.currentNumber % 2 === 0 ? 'even' : 'odd';

  if (flag) {
    hint.classList.add('active');
    hint.textContent = optionsHint[stateNumber];
  } else {
    hint.classList.remove('active');
  }

  if (state.quantity === 0) hint.classList.remove('active');
}

buttonSetting.addEventListener('click', (e) => toggleSetting(e));
exitSetting.addEventListener('click', (e) => toggleSetting(e));

// открытие или закрытия консоли настроек
function toggleSetting(e) {
  e.preventDefault();

  setting.classList.toggle('active');
}

restartButton.addEventListener('click', (e) => restart(e));

// функция для перезапуска игры
function restart(e) {
  e.preventDefault();
  button.classList.remove('disabled');
  state.currentNumber = getRandomNumber(state.minNumber, state.maxNumber);
  state.quantity = 0;
  state.textAnswers = '';

  const rage = document.querySelector('.main__rage');
  rage.textContent = `Диапазон чисел от ${state.minNumber} до ${state.maxNumber}`;

  input.value = '';
  updateStates();
}

// изменение минимального значения числового диапазона
minInput.addEventListener('input', (e) => {
  const value = Number(e.target.value);

  if (value < state.maxNumber) {
    state.minNumber = value;
    restart(e);
  } else {
    alert('минимальное число не может быть больше максимального');
  }
});

// изменение максимального значения числового диапазона
maxInput.addEventListener('input', (e) => {
  const value = Number(e.target.value);

  if (value > state.minNumber) {
    state.maxNumber = value;
    restart(e);
  } else {
    alert('максимальное число не может быть меньше минимального');
  }
});
