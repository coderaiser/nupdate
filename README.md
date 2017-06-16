# Nupdate [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

Update node modules dependecy to last version in `package.json`.

For bower you could use [bupdate](https://github.com/coderaiser/bupdate "bupdate").
Same as:

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
-v, --version       - show version number and exit
-h, --help          - show help and exit
-D, --dev           - update development dependencies
-E, --save-exact    - save exact version of a dependency
-i, --install       - install dependency after updating
-c, --commit        - create commit with updated dependency
-a, --add           - add absent dependency
```

### Use as module

#### nupdate(name, version, info [, options])
- `name` - name of module
- `version` - version of a module
- `info` - stringified content of `package.json`
- `options`: 
  - `dev` - update devDependencies
  - `exact` - update to exact version

```js
const fs = require('fs');
const nupdate = require('nupdate');

const info = fs.readFileSync('package.json', 'utf8');
nupdate('eslint', '4.0.0', info);
// returns
{
    "devDendencies": {
        "eslint": "4.0.0"
    }
}
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

