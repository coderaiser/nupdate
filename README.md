# Nupdate

Update node modules dependecy and change `package.json` if version is bigger.

For bower you could use [bupdate](https://github.com/coderaiser/bupdate "bupdate").
Same as:

```sh
npm r <module> --save && npm i <module> --save
```

## Install

```
npm i nupdate -g
```

## How to use?

```sh
nupdate spawnify
```

### Options

```
-v, --version   - show version number and exit
-h, --help      - show help and exit
-d, --dev       - update development dependencies
-a, --auto      - determine dependencies type and update them
```

### Use as module

```js
const nupdate = require('nupdate');
const update  = nupdate('spawnify', {
    dev: false // default
});

update.on('error', function(error) {
    process.stderr.write(error);
});

update.on('data', function(data) {
    process.stdout.write(data);
});

update.on('close', function() {
    console.log('done');
});
```

## License

MIT
