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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
     * @param file
     * @returns {Promise<StellarSdk.Keypair>}
     */
    StellarKeystore.prototype.publicKey = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file) {
            var fileData;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._fileContents(file);

                        case 2:
                            fileData = _context.sent;
                            return _context.abrupt('return', fileData.address);

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function publicKey(_x) {
            return _ref.apply(this, arguments);
        }

        return publicKey;
    }();

    /**
     * Retrieves a stellar keypair from a keystore file.
     * @param file
     * @param password
     * @returns {Promise<StellarSdk.Keypair>}
     */


    StellarKeystore.prototype.keypair = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(file, password) {
            var fileData, key, secretKey, keypair;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._fileContents(file);

                        case 2:
                            fileData = _context2.sent;
                            _context2.next = 5;
                            return this._keyFromPassword(password, _tweetnaclUtil2.default.decodeBase64(fileData.crypto.salt), fileData.crypto.scryptOptions);

                        case 5:
                            key = _context2.sent;
                            secretKey = _tweetnacl2.default.secretbox.open(_tweetnaclUtil2.default.decodeBase64(fileData.crypto.ciphertext), _tweetnaclUtil2.default.decodeBase64(fileData.crypto.nonce), key);

                            if (secretKey) {
                                _context2.next = 9;
                                break;
                            }

                            throw new Error('Decryption failed. The file or password supplied is invalid.');

                        case 9:
                            keypair = StellarSdk.Keypair.fromSecret(_tweetnaclUtil2.default.encodeUTF8(secretKey));

                            if (!(keypair.publicKey() !== fileData.address)) {
                                _context2.next = 12;
                                break;
                            }

                            throw new Error('The supplied keystore file inconsistent - public key does not match secret key.');

                        case 12:
                            return _context2.abrupt('return', keypair);

                        case 13:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function keypair(_x2, _x3) {
            return _ref2.apply(this, arguments);
        }

        return keypair;
    }();

    /**
     * Creates a keystore file (using the proided keypiar or a random keypair) and downloads it.
     * @param password
     * @param filename
     * @param [keypair]
     * @returns {Promise<StellarSdk.Keypair>}
     */


    StellarKeystore.prototype.createAndDownload = function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(password, filename, keypair) {
            var createdData;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this.create(password, keypair);

                        case 2:
                            createdData = _context3.sent;


                            this._download(filename, JSON.stringify(createdData.fileData));

                            return _context3.abrupt('return', createdData.keypair);

                        case 5:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function createAndDownload(_x4, _x5, _x6) {
            return _ref3.apply(this, arguments);
        }

        return createAndDownload;
    }();

    /**
     * Creates a keystore file's contents using a provided password and the provided keypair or random keypair. Returns a json object representing the keypair file.
     * @param password
     * @param [keypair]
     * @returns {Promise<{keypair: StellarSdk.Keypair, fileData: {}}>}
     */


    StellarKeystore.prototype.create = function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(password, keypair) {
            var newKeypair, salt, key, nonce, ciphertext;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            newKeypair = keypair || StellarSdk.Keypair.random();
                            salt = _tweetnacl2.default.randomBytes(32);
                            _context4.next = 4;
                            return this._keyFromPassword(password, salt, latestScryptOptions);

                        case 4:
                            key = _context4.sent;
                            nonce = this._randomNonce();
                            ciphertext = _tweetnacl2.default.secretbox(_tweetnaclUtil2.default.decodeUTF8(newKeypair.secret()), nonce, key);
                            return _context4.abrupt('return', {
                                keypair: newKeypair,
                                fileData: {
                                    version: version,
                                    address: newKeypair.publicKey(),
                                    crypto: {
                                        ciphertext: _tweetnaclUtil2.default.encodeBase64(ciphertext),
                                        nonce: _tweetnaclUtil2.default.encodeBase64(nonce),
                                        salt: _tweetnaclUtil2.default.encodeBase64(salt),
                                        scryptOptions: latestScryptOptions
                                    }
                                }
                            });

                        case 8:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function create(_x7, _x8) {
            return _ref4.apply(this, arguments);
        }

        return create;
    }();

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