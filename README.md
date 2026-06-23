# Life Capital

Простейшее статическое SPA-приложение для GitHub Pages: личный дашборд управления капиталом, свободой и жизненной стратегией.

## Структура

- `index.html` — разметка страницы.
- `styles.css` — финальная Amber Minimal дизайн-система из переданного `globals.css`: `oklch`-палитра, тёмная тема по умолчанию через `.dark`, светлые `:root`-токены как запасной режим, радиус `0.375rem`, тени и шрифты Inter / Source Serif 4 / JetBrains Mono.
- `script.js` — базовая логика переключения разделов, пересчёта сценариев и графика.

## Локальный просмотр

Откройте `index.html` в браузере. Сборка и фреймворки не нужны.

## Публикация на GitHub Pages

1. Добавьте файлы в репозиторий:

   ```bash
   git add .
   git commit -m "Add Life Capital static dashboard"
   git push -u origin main
   ```

2. Откройте репозиторий на GitHub.
3. Перейдите в `Settings` → `Pages`.
4. В блоке `Build and deployment` выберите:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Сохраните настройки.

Через пару минут сайт будет доступен по адресу вида:

```text
https://denislevakov.github.io/DL_HUB/
```
