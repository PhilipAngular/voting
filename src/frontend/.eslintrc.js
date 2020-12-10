// eslint-disable-next-line no-undef
module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'comma-dangle': [
            'error',
            'never'
        ],
        'no-redeclare': ['error', { 'builtinGlobals': true }],
        'one-var-declaration-per-line': ['error', 'always'],
        'prefer-const': 'error',
        'no-alert': 'error',
        'no-console': 'error',
        'no-debugger': 'error',
        'no-unused-vars': 'error',
        'no-undef': 'error'
    }
};
