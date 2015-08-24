# AAS (Awesome asset server written in NodeJS)

0. [Overview](#overview)
	0. [Installation](#installation)
	1. [Configuration](#configuration)
	2. [Usage](#usage)
	3. [Supported actions](#supported-actions)
	4. [Supported files](#supported-files)
1.	[Customization](#customization)
2. [Who am I?](#who-am-i)
3. [Todo list](#todo-list)
4. [Copyright](#copyright)

## Overview

AAS is a complete ready-to-use asset server that support file versioning as well as data manipulation

##### Example `http://localhost:3939/rai/261671.jpeg?scale=0.5&crop=[200,200]`
(this will get the jpeg named `261671` and apply 0.5 scale and crop 200x200 pixels from the center)

**There are no external runtime dependencies**, you don't need to install anything extra to use this.

**This module is actively developed by Siyuan Gao.**

### Installation

0.	Download the package in .zip
1. `npm install`
2. You can run the tests with `npm test`

### Configuration

AAS is very configurable, but minminal configuration is needed to run on your system.

##### Configure server secret
The server secret is what the server uses to authorize a bucket creation. __(a bucket is a set of assets that belongs together, ie: a bucket can be a app you need to store assets for)__

In `./src/config/config.js`

		secret: 'c9cba3d805ff526866d27b5504005766'
Set this to the server secret you want, it can be anything (string)

##### Configure Host
In order to get some features to work properly, (not required for basic feature) we need to configure the hostname correctly in `./src/config/config.js`
	
	host:       'http://localhost:3939'
Here put the hostname of the server/computer you are running AAS on, if you don't know what to put, leave it default.

**Note:** If you are using a custom port other than `3939`, please change the port name in `host` as well.

		ie. host:       'http://localhost:80'

##### Configure port

		1.	index.js (line 24)
		2. ./src/config/config.js
To specify which port your asset server will be running on, use `process.env.PORT` or specify port in `config.js`

##### Upload file save path

		1.	index.js (line 41)
		2.	./src/config/config.js
You can change the upload file saving path by changing the storage object in line 41 or change it in config.js

**Note:** currently it doesn't support absolute file path, please stick to config.js and use relative path.

##### Upload file save name

		1.	index.js (line 45)
Changing the `filename` function to modify the behavior or the naming process of `multer` module, currently all uploaded files will be named 

		[a 7-14 character unique id].[file extension]
		example: EJuZ0D72.jpeg

### Usage
##### Create a new bucket

**POST** `http://localhost:3939/bucket`

**Params** `secret: [secret], name: [name of the bucket]`

**Errors**

	{
  		"error": "secret is incorrect"
	}
	{
  		"error": "bucket [name] exists"
	}
**Response**

	{
	  "name": "rai2",
	  "key": "Ey0d__X2"
	}
	
**Key** is your key for uploading to the bucket

##### Create a new upload
**POST** `http://localhost:3939/[bucket]/upload`

**Params** `file: [files to be uploaded], key: [bucket key]`

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

##### Get the file

**GET** `http://localhost:3939/[bucket]/filename`

**Params** `none`

**Errors**

	{
  		"error": "file VkWspSXh.jpeg not found."
	}
**Response**

	The file requested

##### To get a specific version of a file

**GET** `http://localhost:3939/[bucket]/[file]?v=[version]`

**Params** `none`

**Errors**

	{
  		"error": "version NygObRwXh1 not found"
	}
**Response**

	The file requested

##### List all the buckets

**GET** `http://localhost:3939/list`

**Params** `none`

**Errors**

	none
	
**Response**

	[
	  "rai2",
	  "rai"
	]
Its a JSON array including all the buckets in the system

##### List all files in buckets

**GET** `http://localhost:3939/[bucket]/list`

**Params** `none`

**Errors**

	{
	  "error": "bucket ra1i not found"
	}
	
**Response**

	[
	  "http://localhost:3939/rai/261671.jpeg"
	]
Its a JSON array including all the files in bucket

##### List all versions for a file

**GET** `http://localhost:3939/[bucket]/[file]/list`

**Params** `none`

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

### Supported actions

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