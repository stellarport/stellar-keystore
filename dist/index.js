'use strict';

exports.__esModule = true;
exports.StellarKeystore = undefined;

var _stellarSdk = require('stellar-sdk');

var StellarSdk = _interopRequireWildcard(_stellarSdk);

var _tweetnacl = require('tweetnacl');

var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

var _tweetnaclUtil = require('tweetnacl-util');

var _tweetnaclUtil2 = _interopRequireDefault(_tweetnaclUtil);

var _scryptAsync = require('scrypt-async');

var _scryptAsync2 = _interopRequireDefault(_scryptAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var version = 'stellarport-1-20-2018';

var latestScryptOptions = {
    N: 16384,
    r: 8,
    p: 1,
    dkLen: _tweetnacl2.default.secretbox.keyLength,
    encoding: 'binary'
};

var StellarKeystore = exports.StellarKeystore = function () {
    function StellarKeystore() {
        _classCallCheck(this, StellarKeystore);
    }

    /**
     * Retrieves a public key from a keystore file.
     * @param keystore<Blob|Object>
     * @returns {Promise<StellarSdk.Keypair>}
     */
    StellarKeystore.prototype.publicKey = function publicKey(keystore) {
        return this._fileContents(keystore).then(function (keystoreData) {
            return keystoreData.address;
        });
    };

    /**
     * Retrieves a stellar keypair from a keystore file.
     * @param keystore<Blob|Object>
     * @param password
     * @returns {Promise<StellarSdk.Keypair>}
     */


    StellarKeystore.prototype.keypair = function keypair(keystore, password) {
        var _this = this;

        var keystoreData = void 0;
        return this._fileContents(keystore).then(function (_keystoreData) {
            keystoreData = _keystoreData;
            return _this._keyFromPassword(password, _tweetnaclUtil2.default.decodeBase64(keystoreData.crypto.salt), keystoreData.crypto.scryptOptions);
        }).then(function (key) {
            var secretKey = _tweetnacl2.default.secretbox.open(_tweetnaclUtil2.default.decodeBase64(keystoreData.crypto.ciphertext), _tweetnaclUtil2.default.decodeBase64(keystoreData.crypto.nonce), key);

            if (!secretKey) {
                throw new Error('Decryption failed. The file or password supplied is invalid.');
            }

            var keypair = StellarSdk.Keypair.fromSecret(_tweetnaclUtil2.default.encodeUTF8(secretKey));

            if (keypair.publicKey() !== keystoreData.address) {
                throw new Error('The supplied keystore file inconsistent - public key does not match secret key.');
            }

            return keypair;
        });
    };

    /**
     * Creates a keystore file (using the proided keypiar or a random keypair) and downloads it.
     * @deprecated
     * @param password
     * @param filename
     * @param [keypair]
     * @returns {Promise<StellarSdk.Keypair>}
     */


    StellarKeystore.prototype.createAndDownload = function createAndDownload(password, filename, keypair) {
        var _this2 = this;

        return this.create(password, keypair).then(function (createdData) {
            _this2._download(filename, JSON.stringify(createdData.walletData));

            return createdData.keypair;
        });
    };

    /**
     * Creates a keystore file's contents using a provided password and the provided keypair or random keypair. Returns a json object representing the keypair file.
     * @param password
     * @param [keypair]
     * @returns {Promise<{keypair: StellarSdk.Keypair, fileData: {}}>}
     */


    StellarKeystore.prototype.create = function create(password, keypair) {
        var _this3 = this;

        var newKeypair = keypair || StellarSdk.Keypair.random();
        var salt = _tweetnacl2.default.randomBytes(32);
        return this._keyFromPassword(password, salt, latestScryptOptions).then(function (key) {
            var nonce = _this3._randomNonce();
            var ciphertext = _tweetnacl2.default.secretbox(_tweetnaclUtil2.default.decodeUTF8(newKeypair.secret()), nonce, key);
            return {
                keypair: newKeypair,
                walletData: {
                    version: version,
                    address: newKeypair.publicKey(),
                    crypto: {
                        ciphertext: _tweetnaclUtil2.default.encodeBase64(ciphertext),
                        nonce: _tweetnaclUtil2.default.encodeBase64(nonce),
                        salt: _tweetnaclUtil2.default.encodeBase64(salt),
                        scryptOptions: latestScryptOptions
                    }
                }
            };
        });
    };

    StellarKeystore.prototype._download = function _download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename + '.strz');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    StellarKeystore.prototype._fileContents = function _fileContents(file) {
        if (!(file instanceof Blob)) {
            return Promise.resolve(file);
        }

        var fileReader = new FileReader();

        fileReader.readAsText(file);

        return new Promise(function (resolve, reject) {
            fileReader.onload = function (event) {
                try {
                    resolve(JSON.parse(event.target.result));
                } catch (e) {
                    reject(new Error('Decryption failed. The file is not a valid keystore file.'));
                }
            };
        });
    };

    StellarKeystore.prototype._keyFromPassword = function _keyFromPassword(password, salt) {
        var scryptOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : latestScryptOptions;

        return new Promise(function (resolve, reject) {
            (0, _scryptAsync2.default)(password, salt, scryptOptions, resolve);
        });
    };

    StellarKeystore.prototype._randomNonce = function _randomNonce() {
        return _tweetnacl2.default.randomBytes(_tweetnacl2.default.secretbox.nonceLength);
    };

    return StellarKeystore;
}();