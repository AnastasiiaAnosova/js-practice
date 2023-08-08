import { Notify } from 'notiflix/build/notiflix-notify-aio';
import storage from "./storage";
// ЗАДАЧА 1

// Якщо імейл і пароль користувача збігаються, зберігайте дані з форми при сабмите
// у локальне сховище і змінюй кнопку login на logout і роби поля введення
// Недоступними зміни.

// При перезавантаженні сторінки, якщо користувач залогінений, ми маємо бачити logout-кнопку
// та недоступні для зміни поля з даними користувача.
// Клік по кнопці logout повертає все до початкового вигляду і видаляє дані користувача
// З локального сховища.

// Якщо введені дані не збігаються з потрібними даними, викликати аlert і
// повідомляти про помилку.

const USER_DATA = {
  email: "user@mail.com",
  password: "secret",
};
const LOCAL_KEY = 'login-data';
let userData = {};
const formElement = document.querySelector('.login-form');
const loginBtn = document.querySelector('.login-btn');
const inputs = document.querySelectorAll('.login-input');
const saveData = storage.load('LOCAL_KEY');

formElement.addEventListener('input', onSaveData);
formElement.addEventListener('submit', onCheckData);

if (saveData) {
    loginBtn.textContent = 'Logout';
    inputs.forEach(input => input.setAttribute('readonly', true));
}

function onSaveData(event) {
    const { name, value } = event.target;
    userData[name] = value;
    // console.log(userData);
}

function onCheckData(e) {
    e.preventDefault();
    if (loginBtn.textContent === 'Logout') {
        loginBtn.textContent = 'Login';
        inputs.forEach(input => input.removeAttribute('readonly'));
        storage.remove(LOCAL_KEY);
        userData = {};
        return;
    }
    const { email, password } = userData;
    if (!email || !password) {
        return Notify.failure('Fill in all fields');
    }
    if (email !== USER_DATA.email || password !== USER_DATA.password) {
        return Notify.failure('The entered data does not match');
    }
    storage.save(LOCAL_KEY, userData);
    loginBtn.textContent = 'Logout';
    inputs.forEach(input => input.setAttribute('readonly', true));
    formElement.reset();
}