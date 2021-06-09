module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": [
        "plugin:prettier/recommended",
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    }
};
