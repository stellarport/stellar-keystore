# Stellar Keystore

## Getting Started

```
npm install stellar-keystore --save
```

```
import {StellarKeystore} from 'stellar-keystore';
```

You can also include it directly in the browser as a script tag and use `StellarKeystore` via the window object.

## Methods

### download()
Creates a keystore file's contents using a provided password and a random keypair. Returns a json object representing the keypair file.

Use like so:
```
create('someRandomPassword');
```

### createAndDownload()
Creates a keystore file (using a random keypair) and downloads it.

Use like so:
```
createAndDownload('someRandomPassword', 'desiredFileName');
```

### keypair()
Retrieves a stellar keypair from a keystore file.

Use like so:
```
keypair(file, 'passwordForFile');
```
where file is an object of type File
