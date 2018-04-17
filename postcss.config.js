module.exports = {
    plugins: [
      require('autoprefixer'),
      require("stylelint")({
        "extends": ["stylelint-config-standard","stylelint-config-recommended-scss"],
        "rules": {
          "number-leading-zero":"never"
        }
      })
    ]
  }