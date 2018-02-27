# Stellar Keystore

This is a helper library for creating stellar keystore wallets.

## What is a keystore wallet?
A keystore wallet is a data blob that stores an encrypted secret key. The objective of a keystore wallet is to allow a user who does not want to remember/manage a secret key
and would instead rather manage a password, to store and securely encrypt their secret key using their desired password.

## What does this library offer?
This library offers methods that will allow your application to create stellar keystore wallets (i.e. keystore wallets containing secret keys controlling stellar public keys)
as well as retrieve a stellar keypair given a keystore wallet/password combination.

## How does stellar-keystore accomplish this?
For more information on the internals please see:
[stellar-keystore third party audit](https://github.com/stellarport/stellar-keystore/blob/master/audit.pdf)

## Getting Started

```
npm install stellar-keystore --save
```

```
import {StellarKeystore} from 'stellar-keystore';
```

You can also include it directly in the browser as a script tag and use `StellarKeystore` via the window object.

## Methods

### create()
Creates a keystore file's contents using a provided password and an optional keypair (uses a random keypair when no keypair is provided). Returns a json object representing the keypair file.

Use like so:
```
create('someRandomPassword', keypair);
```

### createAndDownload()
Creates a keystore file in the same manner as `create()` and downloads it.

Use like so:
```
createAndDownload('someRandomPassword', 'desiredFileName', keypair);
```

### publicKey()
Retrieves a stellar public key from a keystore file.

Use like so:
```
publicKey(keystore);
```
where keystore is an object of type Blob or a json object representing a keystore wallet (i.e. the file contents of a keystore wallet file).

### keypair()
Retrieves a stellar keypair from a keystore file.

Use like so:
```
keypair(keystore, 'passwordForFile');
```
where keystore is an object of type Blob or a json object representing a keystore wallet (i.e. the file contents of a keystore wallet file).
