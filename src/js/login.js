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
const LOCAL_KEY = 'login-data';//ключ по якому буде зберігатися наші дані в local storage   /the key by which our data will be stored in local storage
let userData = {};//обʼєкт, де ми будемо зберігати дані,які ввів нащ користувач, щоб увійти в систему    /the object where we will store the data entered by our user to log in
const formElement = document.querySelector('.login-form');
const inputs = document.querySelectorAll('.login-input');
const submitBtn = document.querySelector('.login-btn');
const saveData = storage.load('LOCAL_KEY');//отримуємо дані з local storage,які ввів користувач   /get data from local storage that the user has entered
const todoForm = document.querySelector('.todo')

formElement.addEventListener('input', onSaveData);
formElement.addEventListener('submit', onSubmitForm);

 /*робимо перевірку отриманих даних з localStorage
 якщо там є дані, тобто true, тоді змінюємо текст кнопки на 'Logout' та встановлюємо атрибут для полів input 'readonly',щоб вони були недоступні для введення або зміни даних
 /check the received data from localStorage
 if there is data there, that is true, then change the text of the button to 'Logout' and set the attribute for the input fields to 'readonly' so that they are not available for entering or changing data
 */
if (saveData) {
    inputs.forEach(input => input.setAttribute('readonly', true));
    submitBtn.textContent = 'Logout';
}

/* ми використовуємо деструктуризацію об'єкта для отримання двох властивостей (name та value) з об'єкта event.target
й ці дані зберігаємо в оголошених змінних name, value
/we use object destructuring to get two properties (name and value) from the event.target object
object and store this data in the declared variables name, value
 */
function onSaveData(event) {
    const { name, value } = event.target;
    userData[name] = value;//записуємо дані в обʼєкт для зберігання даних,що ввів користувач    /write the data to the data storage object entered by the user
}

function onSubmitForm(event) {
    event.preventDefault();//відміняємо дії за змовчування при submit     /cancel default actions on submit
    if (submitBtn.textContent === 'Logout') {
        submitBtn.textContent = 'Login';
        inputs.forEach(input => input.removeAttribute('readonly'));
        storage.remove(LOCAL_KEY);
        userData = {};
        todoForm.style.display = 'none';
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
    submitBtn.textContent = 'Logout';
    inputs.forEach(input => input.setAttribute('readonly', true));
    todoForm.style.display = 'flex';
    formElement.reset();
}