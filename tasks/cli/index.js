#!/bin/sh
//bin/sh -c :; exec /usr/bin/env node --experimental-worker "$0" "$@"
// https://unix.stackexchange.com/questions/65235/universal-node-js-shebang#comment755057_65295

require('dotenv/config')

require('@babel/register')({
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' },
      },
    ],
  ],
  overrides: [
    {
      test: /\.ts$/,
      presets: [
        '@babel/preset-typescript',
      ],
    },
  ],
  extensions: ['.ts', '.js'],
  shouldPrintComment: (val) => val.startsWith('#'),
})

require('./cli')
