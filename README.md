# YAAS.js (Yet another asset server)

0. [Overview](#overview)
	0. [Installation](#installation)
	1. [Build and Run](#build-and-run)
	2. [Configuration](#configuration)
	3. [Usage](#usage)
	4. [Authentication](#authentication)
		0.	[None](#none)
		1. [Local](#local)
	5. [Supported actions](#supported-actions)
	6. [Supported files](#supported-files)
1.	[Customization](#customization)
2. [Who am I?](#who-am-i)
3. [Todo list](#todo-list)
4. [Copyright](#copyright)

## Overview

YAAS is a complete ready-to-use asset server that support file versioning as well as data manipulation

##### Example `http://localhost:3939/rai/261671.jpeg?scale=0.5&crop=[200,200]`
(this will get the jpeg named `261671` and apply 0.5 scale and crop 200x200 pixels from the center)

**There are no external runtime dependencies**, you don't need to install anything extra to use this.

**This module is actively developed by Siyuan Gao.**

### Installation

0.	Download the package in .zip
1. `npm install`
2. `npm install -g gulp`
2. You can run the tests with `npm test`

### Build and run
0.	Run	 `gulp`
1. Run `node ./build`

### Configuration

YAAS is very configurable, but minminal configuration is needed to run on your system.

#### Configure Authority
The server authority is what uses to authorize every request came from the client.

In `./src/config/config.js` (line 21)

		auth: {
        type: 'local',
        keys: {
            c9cba3d805ff526866d27b5504005766: {
                roles: [
                    'yaas:list',
                    'bucket:create',
                    'bucket:upload',
                    'bucket:list',
                    'file:get',
                    'version:list'
                ]
            }
        },
        overwrites: {
            'file:get': 'none',
            'version:list': 'none'
        }
    }
    
`auth` is an object, it has two properties, `type` and anything else.
`type` is requires indicating what type of authentication will be using
	
* none (anything is ok)
* local (api key and role based authentication)
* overwrites is for the roles you want to apply a different authentication method (example: `'file:get': 'none'` means even we defined local authentical for every action, we will skip authentication for `file:get`

More information is [here](#authentication)

#### Configure Host
In order to get some features to work properly, (not required for basic feature) we need to configure the hostname correctly in `./src/config/config.js`
	
	host:       'http://localhost:3939'
Here put the hostname of the server/computer you are running YAAS on, if you don't know what to put, leave it default.

**Note:** If you are using a custom port other than `3939`, please change the port name in `host` as well.

		ie. host:       'http://localhost:80'

#### Configure port

		1.	index.js (line 24)
		2. ./src/config/config.js
To specify which port your asset server will be running on, use `process.env.PORT` or specify port in `config.js`

#### Upload file save path

		1.	index.js (line 41)
		2.	./src/config/config.js
You can change the upload file saving path by changing the storage object in line 41 or change it in config.js

**Note:** currently it doesn't support absolute file path, please stick to config.js and use relative path.

#### Upload file save name

		1.	index.js (line 45)
Changing the `filename` function to modify the behavior or the naming process of `multer` module, currently all uploaded files will be named 

		[a 7-14 character unique id].[file extension]
		example: EJuZ0D72.jpeg

### Usage
#### Create a new bucket

**POST** `http://localhost:3939/bucket`

**Params** `auth: [credential], name: [name of the bucket]`

**Errors**

	{
  		"error": "bucket [name] exists"
	}
**Response**

	{
	  "message": "bucket rai2 created",
	  "url": "http://localhost:3939/rai"
	}
	
**url** if host is configured correctly, this will be the url for accessing your bucket

#### Create a new upload
**POST** `http://localhost:3939/[bucket]/upload`

**Params** `auth: [credential], file: [files to be uploaded]`

**Errors**

	{
  		"error": "file not supplied"
	}
	{
  		"error": "bucket [name] not found"
	}
	{
		"error": "bucket key is incorrect"
	}
**Output**
	
	{
	  "fieldname": "file",
	  "originalname": "261671.jpeg",
	  "encoding": "7bit",
	  "mimetype": "image/jpeg",
	  "destination": "./storage/",
	  "filename": "EJuZ0D72.jpeg",
	  "path": "storage/EJuZ0D72.jpeg",
	  "size": 205643,
	  "versions": {
	    "NygObRwXh": "storage/EJuZ0D72.jpeg"
	  },
	  "latestversion": "NygObRwXh",
	  "url": "http://localhost:3939/rai/261671.jpeg"
	}
This is all the information stored on local [nedb](https://github.com/louischatriot/nedb), including all the versions and the latest version, with the url to access the file.

#### Get the file

**GET** `http://localhost:3939/[bucket]/filename`

**Params** `auth: [credential]`

**Errors**

	{
  		"error": "file VkWspSXh.jpeg not found."
	}
**Response**

	The file requested

#### To get a specific version of a file

**GET** `http://localhost:3939/[bucket]/[file]?v=[version]`

**Params** `auth: [credential]`

**Errors**

	{
  		"error": "version NygObRwXh1 not found"
	}
**Response**

	The file requested

#### List all the buckets

**GET** `http://localhost:3939/list`

**Params** `auth: [credential]`

**Errors**

	none
	
**Response**

	[
	  "rai2",
	  "rai"
	]
Its a JSON array including all the buckets in the system

#### List all files in buckets

**GET** `http://localhost:3939/[bucket]/list`

**Params** `auth: [credential]`

**Errors**

	{
	  "error": "bucket ra1i not found"
	}
	
**Response**

	[
	  "http://localhost:3939/rai/261671.jpeg"
	]
Its a JSON array including all the files in bucket

#### List all versions for a file

**GET** `http://localhost:3939/[bucket]/[file]/list`

**Params** `auth: [credential]`

**Errors**

	{
	  "error": "file 2616721.jpeg not found."
	}
	{
	  "error": "bucket r1ai not found"
	}
	
**Response**

	[
	  "http://localhost:3939/rai/261671.jpeg?v=NygObRwXh"
	]
Its a JSON array including all version urls for a file, if only one file exist, you can access it just by url (without the v)

### Authentication

#### None
For this authenticatin type, server will ignore anything in the auth field which means you don't have to provide any credentials.

**Note:** not recommended, should be used as overwrite to make some calls public

#### Local
For this authentication type, api keys will be defined in `config.js` like this:

	auth: {
        type: 'local',
        keys: {
            c9cba3d805ff526866d27b5504005766: {
                roles: [
                    'yaas:list',
                    'bucket:create',
                    'bucket:upload',
                    'bucket:list',
                    'file:get',
                    'version:list'
                ]
            }
        },
        overwrites: {
            'file:get': 'none',
            'version:list': 'none'
        }
    }
**First** `type` tells the server we are using `local` as authentication method, so during server's bootstrap, the correct authenticator will be loaded.

**Second**, `keys` tells server what keys are allowed to access this api, the `role` is an array contains all the roles the key is authrorized.

**Last** (optional), `overwrites` is very important if you want to customize authentications type for each role. The example here `'file:get' : 'none'` means even the global authentication method is `local`, we will skil authentication for `'file:get': 'none'` 


### Supported actions

* image/jpeg
	* scale
	* crop (from center or specify x,y)
	* rotate (degrees, fill color is white)
	* blur (glaussan blur)
	* sharken (sharpen the image)
	* mirror (flip the image around an axis)
	* saturate (adjust saturation)
	* lighten (increase brightness)
	* darken (decrease brightness)
	* hue (adjust hue)
* application/json
	* search

### Supported files

* image/jpeg

## Customization

##### File transformation
This is a tough part, to modify the transformation for a specific file, first I need to talk about the transformation files stored in project structure

```
-transform (the root folder for all transformation)
|--image	(the root folder for mimetype image)
  |--jpeg	(the root folder containing image/jpeg transformation
    |--transform.js (the actual file for image/jpeg transformation
```
You might have seen, the transformation files are stored according to their mimetype. For example, the `text/javascript` mimetype will be stored under `./src/transform/text/javascript/transform.js`

**Note:** For any transformation you define, make sure it returns a **Promise** and resolve the transformed file path.

## Who am I?

I am Siyuan Gao, a Mobile application developer, full-stack developer, designer from Vancouver, BC. I creates projects all the time for fun, or just because I want to bring a tool to life. To contact me, please email me at: `siyuangao at gmail d0t c0m`

## Todo list

0. Make the project more stuctured, (no more big source files)
1. Make adding transformation easier
2. Allow user to config authentication [*](#authentication)
3. HTTPS support
4. Better manage disk space
5. More Mocha tests (**sorry, need to write more tests)

***
If you want to help out, feel free to fork and send me a pull request.

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
