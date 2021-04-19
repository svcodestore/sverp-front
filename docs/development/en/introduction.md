# Introduction

The development mode of the system is separation of front-end and backend.Front-end uses Vue + Ant Design Vue Pro  to develop quickly.Backend uses PHP7 + MySQL8 + ThinkPHP6 to develop APIs quickly.

## Front-end Directory Structure
VuePress follows the principle of **"Convention is better than configuration"**. The recommended structure is as follows:
```vue
<!-- textlint-disable terminology -->

::: vue
.
├── client
│   ├── .vscode _(**Optional**)_
│   ├── config
│   │   ├── plugin.config.js
│   │   └── themePluginConfig.js
│   ├── `docs` _(**Optional**)_
│   ├── public 
├── ├── src 
├── ├── tests 
├── ├── .browserslistrc 
├── ├── .editorconfig 
├── ├── .env
├── ├── .eslintrc.js
├── ├── .prettierrc
├── ├── babel.config.js
├── ├── jest.config.js
├── ├── jsconfig.json
├── ├── postcss.config.js
├── ├── vue.config.js
│   └── package.json
:::

<!-- textlint-enable -->

::: warning Note
Please note the capitalization of the directory name.
:::

- `docs/.vuepress`: Used to store global configuration, components, static resources, etc.
- `docs/.vuepress/components`: The Vue components in this directory will be automatically registered as global components.
- `docs/.vuepress/theme`: Used to store local theme.
- `docs/.vuepress/styles`: Stores style related files.
- `docs/.vuepress/styles/index.styl`: Automatically applied global style files, generated at the ending of the CSS file, have a higher priority than the default style.
- `docs/.vuepress/styles/palette.styl`: The palette is used to override the default color constants and to set the color constants of Stylus.
- `docs/.vuepress/public`: Static resource directory.
- `docs/.vuepress/templates`: Store HTML template files.
- `docs/.vuepress/templates/dev.html`: HTML template file for development environment.
- `docs/.vuepress/templates/ssr.html`: Vue SSR based HTML template file in the built time.
- `docs/.vuepress/config.js`: Entry file of configuration, can also be `yml` or `toml`.
- `docs/.vuepress/enhanceApp.js`: App level enhancement.

::: warning Note
When customizing `templates/ssr.html`, or `templates/dev.html`, it’s best to edit it on the basis of the [default template files](https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/core/lib/client/index.dev.html), otherwise it may cause a build failure.
:::
```

# Backend Directory Structure

```php
::: php
.
├── backend
│   ├── .vscode _(**Optional**)_
│   ├── app
│   │   ├── command
│   │   └── webApi
│   ├── config
│   ├── extend
├── ├── public
├── ├── route
├── ├── runtime
├── ├── vendor
├── ├── view
├── ├── .env
├── ├── .example.env
├── ├── composer.json
│   └── think
:::
```