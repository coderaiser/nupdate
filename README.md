# Nupdate [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

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

[NPMIMGURL]:                https://img.shields.io/npm/v/nupdate.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/nupdate/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/gemnasium/coderaiser/nupdate.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/nupdate "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/nupdate  "Build Status"
[DependencyStatusURL]:      https://gemnasium.com/coderaiser/nupdate "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

