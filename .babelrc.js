// this file will be used by default by babel@7 once it is released

module.exports = {
    "plugins": [
        "transform-decorators-legacy",
        "syntax-object-rest-spread",
        "transform-class-properties"
    ],
    "presets": [
        [
            "env", {
            "targets": {
                "browsers": [
                    "last 2 versions",
                    "safari >= 7",
                    "not ie <= 11"
                ],
            },
            "loose": true,
            "modules": 'commonjs',
            "useBuiltIns": true
        }
        ]
    ]
};
