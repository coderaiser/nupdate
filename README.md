# Nupdate [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

Update node modules dependecy to last version in `package.json`. For bower you could use [bupdate](https://github.com/coderaiser/bupdate "bupdate").
Respects `commitType = colon | paren` from `package.json`.

## Install

```
npm i nupdate -g
```

## How to use?

Update `spawnify` to latest version:

```sh
nupdate spawnify
```

Update to known version:

```sh
nupdate eslint:9.0.0-alpha.0
```

### Options

```
Usage: nupdate [pattern] [options]
Options:
-v, --version        show version number and exit
-h, --help           show help and exit
-D, --dev            update development dependencies
-E, --save-exact     save exact version of a dependency
-i, --install        install dependency after updating
-c, --commit         create commit with updated dependency
-a, --add            add absent dependency
-r, --remove         remove dependency
-*, --set-any        set * as dependency version
--public             set publichConfig access='public'
--restricted         set publichConfig access='restricted'
```

### Use as module

#### nupdate(name, version, info [, options])

- `name` - name of module
- `version` - version of a module
- `info` - stringified content of `package.json`
- `options`:
  - `dev` - update devDependencies
  - `exact` - update to exact version
  - `add` - add absent dependency
  - `remove` - remove dependency
  - `set-any` - set `*` as dependency version

```js
import fs from 'node:fs';
import nupdate from 'nupdate';

const info = fs.readFileSync('package.json', 'utf8');
nupdate('eslint', '9.0.0:aplha.0', info);
// returns
({
    devDendencies: {
        eslint: '9.0.0',
    },
});
```

## License

MIT

[NPMIMGURL]: https://img.shields.io/npm/v/nupdate.svg?style=flat
[BuildStatusIMGURL]: https://img.shields.io/travis/coderaiser/nupdate/master.svg?style=flat
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/nupdate "npm"
[BuildStatusURL]: https://travis-ci.org/coderaiser/nupdate "Build Status"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
