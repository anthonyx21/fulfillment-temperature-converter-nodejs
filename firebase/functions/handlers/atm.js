const { Text, Card, Image, Suggestion, Payload } = require('dialogflow-fulfillment')

var i18n = require('i18next')
i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: require('../locales/en-US/translation')
    }
  }
})

// Wikipedia link and image URLs
module.exports = {
  blah: agent => {
    agent.add(i18n.t('convertFahrenheitAndCelsius'))
  }
}
