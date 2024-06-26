# Бэкенд Mesto. Каркас API Mesto
## Описание
Это серверная часть веб-приложения Mesto, представляющая из себя API для управления пользователями и карточками. Пользователи могут регистрироваться, изменять информацию о себе и загружать фотографии. Карточки с фотографиями могут быть добавлены, удалены или оценены путем установки/снятия лайков.


## Используемые технологии и решения
- Typescript в качестве основного языка проекта
- Mongodb и ODM Mongoose для хранения данных пользователей и карточек
- Node.js в качестве среды выполнения
- Express.js для создания HTTP-сервера
- JWT для аутентификации (хранится в httpOnly куке)
- celebrate и Joi для валидации запросов
- Helmet для установки безопасных HTTP заголовков
- express-rate-limit для ограничения частоты запросов
- cookie-parser для упрощенного доступа к кукам
- winston и winston-daily-rotate-file для записи и автоматизации логов


## Установка и запуск
Для работы с проектом вам необходимо:

#### 1. Клонировать проект с помощью команды

```shell
git clone git@github.com:nurmy-26/mesto-project-plus.git
```

#### 2. Установить зависимости

```shell
npm i
```

#### 3. Запустить локальный сервер
```shell
npm start
```

#### NB! Перед запуском убедитесь, что вы настроили следующие переменные окружения в файле <code>.env</code>:
```
NODE_ENV=development # or production
PORT=4000
MONGO_URL=mongodb://127.0.0.1/your-db
SALT_ROUNDS=10
SECRET_KEY=your-secret-key
TOKEN_LIFETIME_SECONDS=604800 # 7 дней в секундах
```

Если вы этого не сделали, по умолчанию переменные будут браться из перечисления ENV_EXAMPLE из файла src/utils/constants.

<details>
  <summary><i>Подробнее о каждой переменной</i></summary>
  <p><code>NODE_ENV</code> - режим работы сервера: development или production.</p>

  <p><code>PORT</code> - порт, на котором будет запускаться сервер.</p>

  <p><code>MONGO_URL</code> - ссылка на локальную базу данных MongoDB.</p>

  <p><code>SALT_ROUNDS</code> - количество раундов соления при хешировании пароля.</p>

  <p><code>SECRET_KEY</code> - секретный ключ для JWT.</p>

  <p><code>TOKEN_LIFETIME_SECONDS</code> - время жизни токена и куки токена.</p>
</details>

#### 4. Используйте Postman или аналогичное приложение для отправки запросов к API
#### 5. Также вы можете использовать MongoDB Compass для наблюдения за данными в базе данных

## Работа с API
Ниже представлен список доступных конечных точек (endpoints) API и краткое описание каждой из них.

### Регистрация и авторизация

- `POST /signup`
  - Описание: Регистрация нового пользователя.
  - Параметры: Нет.
  - Тело запроса: 
json
```
    {
      "name": "Имя пользователя", // необязательное поле
      "about": "Информация о пользователе", // необязательное поле
      "avatar": "URL аватара пользователя", // необязательное поле
      "email": "Электронная почта",
      "password": "Пароль"
    }
```

- `POST /signin`
  - Описание: Аутентификация пользователя (логин).
  - Параметры: Нет.
  - Тело запроса: 
json
```
    {
      "email": "Электронная почта",
      "password": "Пароль"
    }
```

### Пользователи

- `GET /users`
  - Описание: Получение списка всех пользователей.
  - Параметры: Нет.
  - Тело запроса: Не требуется.
  - Пример ответа:
json
```
    [
      {
        "name": "Имя пользователя",
        "about": "О себе",
        "avatar": "ссылка на изображение"
        "_id": "userId"
      },
      ...
    ]
```

- `GET /users/me`
  - Описание: Получение данных авторизованного пользователя.
  - Параметры: Нет.
  - Тело запроса: Не требуется.
  - Пример ответа:
json
```
    {
      "name": "Имя пользователя",
      "about": "О себе",
      "avatar": "ссылка на изображение",
      "email": "электронная почта пользователя",
      "_id": "userId"
    }
```

- `PATCH /users/me`
  - Описание: Обновление профиля пользователя.
  - Параметры: Нет.
  - Тело запроса:
json
```
    {
      "name": "Новое имя",
      "about": "Новая информация о себе"
    }
```
В ответе придет JSON-объект с полями name, about, avatar, email, _id аналогично примерам выше.


- `PATCH /users/me/avatar`
  - Описание: Обновление аватара пользователя.
  - Параметры: Нет.
  - Тело запроса:
json
```
    {
      "avatar": "ссылка на новый аватар"
    }
```
В ответе придет JSON-объект с полями avatar, _id аналогично примерам выше.

- `GET /users/:id`
  - Описание: Получение пользователя по уникальному идентификатору (ID).
  - Параметры:
    - `id`: идентификатор пользователя.
  - Тело запроса: Не требуется.
  - Пример ответа:
json
```
    {
      "name": "Имя пользователя",
      "about": "О себе",
      "avatar": "ссылка на изображение",
      "_id": "userId"
    }
```

### Карточки

- `GET /cards`
  - Описание: Получение списка всех карточек.
  - Параметры: Нет.
  - Тело запроса: Не требуется.
  - Пример ответа:
json
```
    [
      {
        "name": "Имя карточки",
        "link": "ссылка на фотографию для карточки",
        "owner": "userId",
        "likes": [
            // массив id пользователей, поставивших лайки, или пустой массив
            userId1,
            userId2,
            ...
        ],
        "createdAt": "2020-05-21T17:27:37.655Z",
        "_id": "userId"
      },
      ...
    ]
```

- `POST /cards`
  - Описание: Создание новой карточки с фотографией и названием.
  - Параметры: Нет.
  - Тело запроса:
json
```
    {
      "name": "Название карточки",
      "link": "ссылка на фотографию для карточки"
    }
```

- `DELETE /cards/:id`
  - Описание: Удаление карточки по её ID.
  - Параметры:
    - `id`: идентификатор карточки.
  - Тело запроса: Не требуется.
  - Ответ: JSON-объект карточки аналогично примеру выше.

- `PUT /cards/:id/likes`
  - Описание: Добавление лайка карточке по её ID.
  - Параметры:
    - `id`: идентификатор карточки.
  - Тело запроса: Не требуется.
  - Ответ: JSON-объект карточки аналогично примеру выше.

- `DELETE /cards/:id/likes`
  - Описание : Удаление лайка с указанной карточки по её ID.
  - Параметры :
    - ' id ': идентификатор карточки.
  - Тело запроса: Не требуется.
  - Ответ: JSON-объект карточки аналогично примеру выше.

#### NB! Обратите внимание, что все операции, кроме регистрации и логина, требуют, чтобы пользователь был авторизован: 
`POST /signin`
