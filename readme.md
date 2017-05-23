# AE to HTML

Prototype site for exporting after effects animations to HTML

## Setup

- make sure [node.js](http://nodejs.org) is at version >= `6`
- `npm i spike -g`
- clone this repo down and `cd` into the folder
- run `npm install`
- run `spike watch` or `spike compile`

## Usage

- Export animations from After Effects using *Bodymovin*
- Modify your .json filenames so titles etc. on the site will look how you want them to:
  - Use dashes to separate words, i.e. `JSON-File-Name.json` will Create the title **JSON File Name**
  - Capitalize anything you would like capitalized.
- Add resulting .json files to the `assets/anim/` folder


## Testing
Tests are located in `test/**` and are powered by [ava](https://github.com/sindresorhus/ava)
- `npm install` to ensure devDeps are installed
- `npm test` to run test suite
