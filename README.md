# recipesearch
A learning project I use to improve my js skills after taking an online course. 

### Dependencies
```
npm install live-server --global
```

### Start the dev server:
```
npm run start
```

### In case of compatibility issues

For babel, instead of installing babel-core, babel-preset-env and babel-polyfill in the babel lecture, please install @babel/core, @babel/preset-env, core-js@3, and regenerator-runtime like this:


```
npm install --save-dev @babel/core @babel/preset-env babel-loader npm install --save core-js@3 regenerator-runtime
```


You will also need to change the entry in webpack.config.js from this:

entry: ['babel-polyfill', './src/js/index.js'],
to this:

entry: ['./src/js/index.js'],
and the code in .babelrc from this:

```
{
    "presets": [
        ["env", {
            "targets": {
                "browsers": [
                    "last 5 versions",
                    "ie >= 8"
                ]
            }
        }]
    ]
}
```
to this:

```
{
    "presets": [
        ["@babel/env", {
            "useBuiltIns": "usage",
            "corejs": "3",
            "targets": {
                "browsers": [
                    "last 5 versions",
                    "ie >= 8"
                ]
            }
        }]
    ]
}
```
