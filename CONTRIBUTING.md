# Разработка

Для тех, кто правит этот репозиторий: как собирается пакет, чем проверяется и
как попадает в реестр. Подключение и использование пакета описаны в
[README](README.md).

## Требования

Node.js 22 или новее (`engines.node` в манифесте). CI прогоняет сборку и тесты
на 22.x и 24.x, публикация идёт на 24.x.

```shell
git clone https://github.com/nii-energomash/metrology-formatting.git
cd metrology-formatting
npm ci
```

## Структура

```
src/
  index.js              точка входа, реэкспорт публичного API
  FormattingUtility.js  неймспейс-объект со всеми функциями
  standardForm.js       стандартная форма: строка и объект
  percentage.js         проценты
  numeric.js            разбор значения и округление
tests/                  юнит-тесты по src/
tests-dist/             проверка собранного пакета
samples/                демонстрационная страница
```

## Демонстрационная страница

```shell
npm run dev
```

Vite поднимает сервер разработки и открывает `samples/index.html`. Страница
импортирует исходники из `src/`, сборка для неё не нужна.

## Сборка

Сборку ведёт Vite в режиме библиотеки ([vite.config.js](vite.config.js)): из
`src/index.js` получаются `dist/index.js` (ESM), `dist/index.cjs` (CommonJS) и
`dist/index.iife.js` (браузер, глобальная переменная `metrologyFormatting`).
Все три сборки минифицируются terser'ом и снабжаются картами кода.

```shell
npm run build
```

Команда проверяет больше, чем собирает, — проверки подвешены на хуки:

- `prebuild` — форматирование (`npm run format:check`);
- `postbuild` — [publint](https://publint.dev/) (`npm run lint:publish`): пути
  в `exports`, наличие файлов по ним, рассогласование ESM и CJS; следом —
  проверка собранного пакета (`npm run test:dist`).

Падение любой из них роняет `npm run build`.

## Проверка собранного пакета

Тесты в `tests-dist/` проверяют то, чего не видят юнит-тесты по `src/`:

- `require` и `import` отдают публичные экспорты;
- браузерная сборка, выполненная в пустом контексте `node:vm`, объявляет
  глобаль `metrologyFormatting`.

Сборки грузятся по имени пакета, а не по пути в `dist`, поэтому под проверку
попадает и карта `exports`.

```shell
npm run test:dist
```

Команда проверяет уже собранный `dist` и сама его не собирает: при
`npm run build` она запускается хуком `postbuild`. Отдельный конфиг
[vitest.dist.config.js](vitest.dist.config.js) держит эти тесты вне выборки
`npm test`.

## Тесты

Vitest, окружение `node` — библиотека не зависит от DOM.

```shell
npm test
```

Хук `pretest` сначала запускает линт. Команды ниже его не тянут — они для
работы над кодом:

```shell
npm run test:watch
npm run test:ui
npm run test:coverage
```

Покрытие считается провайдером v8 по `src/**`.

## Линт и форматирование

ESLint с плоским конфигом ([eslint.config.js](eslint.config.js)) и Prettier.
Конфликтующие стилевые правила гасит `eslint-config-prettier`, поэтому ESLint
отвечает за ошибки, а Prettier — за оформление.

```shell
npm run lint
npm run lint:fix
npm run format
```

Концы строк — LF: так требуют `.gitattributes` и `.prettierrc`. Файл, попавший
в рабочую копию с CRLF до появления `.gitattributes`, `prettier --check`
считает неотформатированным, хотя в git он в порядке; лечится повторной
выгрузкой файла из git.

## CI

Воркфлоу вызывают только `npm run build` и `npm test` — всё проектное живёт в
хуках манифеста. Поэтому локальный прогон этих двух команд проверяет ровно то
же, что CI, а набор проверок меняется в `package.json` без правки воркфлоу.
Воркфлоу следуют шаблонам
[nii-energomash/automation](https://github.com/nii-energomash/automation/tree/master/ci-src).

## Версии и публикация

Поле `version` в манифесте всегда равно `0.0.0`. Реальную версию проставляет CI
из git-тега вида `v1.2.3` в момент публикации — в репозитории версия не
хранится и вручную не правится.

Публикация запускается публикацией релиза, а не push тега: релиз —
преднамеренный акт с release notes. Упавший прогон переигрывается кнопкой
Re-run, невыпущенный тег добирается созданием релиза на нём, а переиздать уже
выпущенную версию нельзя: реестр не даёт перезаписать `name@version`.

dist-tag выбирается автоматически
([prepare-npm-release](.ci/actions/prepare-npm-release/action.yml)): старшему
тегу репозитория достаётся `latest`, предрелизу — `next`, тегу неактуальной
линии — `lts-v<мажор>`.

Помимо GitHub в репозитории лежит зеркальный набор воркфлоу для Gitea
(`.gitea/workflows`). Gitea тянет с GitHub только рефы, релизы у неё свои и
создаются отдельно — выпуск версии на обеих площадках это два действия.

## Токены

- **GitHub** — встроенный `GITHUB_TOKEN`. Он не истекает, не требует ручного
  обновления и ограничен этим репозиторием; права выдаёт блок `permissions`
  воркфлоу.
- **Gitea** — PAT в секрете `GT_PACKAGES_TOKEN`. Автоматический `GITEA_TOKEN`
  не имеет авторизации на запись в реестр пакетов. Адрес реестра собирается из
  переменных репозитория `REGISTRY_HOST` и `REGISTRY_OWNER`.
