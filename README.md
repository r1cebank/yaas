# YAAS.js (Yet another asset server)

[![Join the chat at https://gitter.im/r1cebank/yaas](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/r1cebank/yaas?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![codecov.io](http://codecov.io/github/r1cebank/yaas/coverage.svg?branch=master)](http://codecov.io/github/r1cebank/yaas?branch=master)
[![Dependencies](https://david-dm.org/r1cebank/yaas.svg)](https://david-dm.org/r1cebank/yaas.svg)
[![Circle CI](https://circleci.com/gh/r1cebank/yaas.svg?style=svg)](https://circleci.com/gh/r1cebank/yaas)
[![Inline docs](http://inch-ci.org/github/r1cebank/yaas.svg?branch=master)](http://inch-ci.org/github/r1cebank/yaas)
[![Stories in Ready](https://badge.waffle.io/r1cebank/yaas.png?label=ready&title=Ready)](https://waffle.io/r1cebank/yaas)

### Important notice: yaas is using `redis` for job queue, you will have to install `redis` before using yaas.

### [Detailed Documentation on readme.io](https://yaas.readme.io/docs)

0. [Overview](#overview)
	0. [Installation](#installation)
	1. [Build and Run](#build-and-run)
	2. [Configuration](#configuration)
	3. [Documentation](#documentation)
1. [Who am I?](#who-am-i)
2. [Todo list](#todo-list)
3. [Copyright](#copyright)

## Overview

YAAS is a complete ready-to-use asset server that support file versioning as well as data manipulation

##### Example `http://localhost:3939/buckets/rai/261671.jpeg?scale=0.5&crop=[200,200]`
(this will get the jpeg named `261671` and apply 0.5 scale and crop 200x200 pixels from the center)

**There are no external runtime dependencies**, you don't need to install anything extra to use this.

**This module is actively developed by Siyuan Gao.**

### Installation

0.	Download the package in .zip
1. `npm install`
2. `npm install -g gulp`
2. You can run the tests with `npm test`

or...

0. run `npm install yaas`
1. the install script will run and prompt for configuration
2. follow the instructions
3. run yaas!

### Build and run
0.	Run	 `gulp`
1. Run `node ./build`

### Configuration

YAAS is very configurable, but minminal configuration is needed to run on your system.

### Documentation

yaas uses `readme.io` for documentation, to learn more about yaas, please go to [http://yaas.readme.io](http://yaas.readme.io)

## Who am I?

I am Siyuan Gao, a Mobile application developer, full-stack developer, designer from Vancouver, BC. I creates projects all the time for fun, or just because I want to bring a tool to life. To contact me, please email me at: `siyuangao at gmail d0t c0m`

## Todo list

0. Make the project more stuctured, (no more big source files)
1. Make adding transformation easier
2. Allow user to config authentication
3. HTTPS support
4. Better manage disk space
5. More Mocha tests (**sorry, need to write more tests)

***
If you want to help out, feel free to fork and send me a pull request.

## Coverage graph

![codecov.io](http://codecov.io/github/r1cebank/yaas/branch.svg?branch=master)

## Copyright

The MIT License (MIT)

Copyright (c) 2015 Siyuan Gao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
