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
const wikipediaTemperatureUrl = 'https://en.wikipedia.org/wiki/Temperature'
const wikipediaTemperatureImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/23/Thermally_Agitated_Molecule.gif'
const wikipediaCelsiusUrl = 'https://en.wikipedia.org/wiki/Celsius'
const wikipediaCelsiusImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Celsius_original_thermometer.png'
const wikipediaFahrenheitUrl = 'https://en.wikipedia.org/wiki/Fahrenheit'
const wikipediaFahrenheitImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Fahrenheit_small.jpg'
const wikipediaKelvinUrl = 'https://en.wikipedia.org/wiki/Kelvin'
const wikipediaKelvinImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Lord_Kelvin_photograph.jpg'
const wikipediaRankineUrl = 'https://en.wikipedia.org/wiki/Rankine_scale'
const wikipediaRankineImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/58/Rankine_William_signature.jpg'

module.exports = {
  'Default Welcome Intent': agent => {
    agent.add('Welcome to the temperature converter!')
    agent.add(
      new Card({
        title: 'Vibrating molecules',
        imageUrl: wikipediaTemperatureImageUrl,
        text: 'Did you know that temperature is really just a measure of how fast molecules are vibrating around?! 😱',
        buttonText: 'Temperature Wikipedia Page',
        buttonUrl: wikipediaTemperatureUrl
      })
    )
    agent.add(i18n.t('welcome'))
    agent.add(new Suggestion('27° Celsius'))
    agent.add(new Suggestion('-40° Fahrenheit'))
    agent.add(new Suggestion('Cancel'))
  },
  'Convert Fahrenheit and Celsius': agent => {
    // Get parameters from Dialogflow to convert
    const temperature = agent.parameters.temperature
    const unit = agent.parameters.unit
    console.log(`User requested to convert ${temperature}° ${unit}`)

    let convertedTemp, convertedUnit, temperatureHistory
    if (unit === 'Celsius') {
      convertedTemp = temperature * (9 / 5) + 32
      convertedUnit = 'Fahrenheit'
      temperatureHistory = new Card({
        title: 'Fahrenheit',
        imageUrl: wikipediaFahrenheitImageUrl,
        text: 'Daniel Gabriel Fahrenheit, invented the Fahrenheit scale (first widely used, standardized temperature scale) and the mercury thermometer.',
        buttonText: 'Fahrenheit Wikipedia Page',
        buttonUrl: wikipediaFahrenheitUrl
      })
    } else if (unit === 'Fahrenheit') {
      convertedTemp = (temperature - 32) * (5 / 9)
      convertedUnit = 'Celsius'
      temperatureHistory = new Card({
        title: 'Celsius',
        imageUrl: wikipediaCelsiusImageUrl,
        text: 'The original Celsius thermometer had a reversed scale, where 100 is the freezing point of water and 0 is its boiling point.',
        buttonText: 'Celsius Wikipedia Page',
        buttonUrl: wikipediaCelsiusUrl
      })
    }

    // Sent the context to store the parameter information
    // and make sure the followup Rankine
    agent.setContext({
      name: 'temperature',
      lifespan: 1,
      parameters: { temperature: temperature, unit: unit }
    })

    // Compile and send response
    agent.add(`${temperature}° ${unit} is  ${convertedTemp}° ${convertedUnit}`)
    agent.add(temperatureHistory)
    agent.add(i18n.t('convertFahrenheitAndCelsius'))
    agent.add(new Suggestion('Kelvin'))
    agent.add(new Suggestion('Rankine'))
    agent.add(new Suggestion('Cancel'))
  },
  'Convert Rankine and Kelvin': agent => {
    const secondUnit = agent.parameters.absoluteTempUnit
    const tempContext = agent.getContext('temperature')
    const originalTemp = tempContext.parameters.temperature
    const originalUnit = tempContext.parameters.unit

    // Convert temperature
    let convertedTemp, convertedUnit, temperatureHistoryText, temperatureHistoryImage
    if (secondUnit === 'Kelvin') {
      convertedTemp = originalTemp === 'Celsius' ? originalTemp + 273.15 : (originalTemp - 32) * (5 / 9) + 273.15
      convertedUnit = 'Kelvin'
      temperatureHistoryText = 'Here is a picture of the namesake of the Rankine unit, William John Macquorn Rankine:'
      temperatureHistoryImage = new Image(wikipediaKelvinImageUrl)
    } else if (secondUnit === 'Rankine') {
      convertedTemp = originalTemp === 'Fahrenheit' ? originalTemp + 459.67 : originalTemp * (9 / 5) + 32 + 459.67
      convertedUnit = 'Rankine'
      temperatureHistoryText = 'Here is a picture of the namesake of the Kelvin unit, Lord Kelvin:'
      temperatureHistoryImage = new Image(wikipediaRankineImageUrl)
    }

    // Set `temperature` context lifetime to zero
    // to reset the conversational state and parameters
    agent.setContext({ name: 'temperature', lifespan: 0 })

    // Compile and send response
    agent.add(`${originalTemp}° ${originalUnit} is  ${convertedTemp}° ${convertedUnit}. ` + temperatureHistoryText)
    agent.add(new Image(temperatureHistoryImage))
    agent.add(i18n.t('convertRankineAndKelvin'))
    agent.add(new Suggestion('27° Celsius'))
    agent.add(new Suggestion('-40° Fahrenheit'))
    agent.add(new Suggestion('Cancel'))
  },
  'Default Fallback Intent': agent => {
    agent.add('Woah! Its getting a little hot in here.')
    agent.add(`I didn't get that, can you try again?`)
  }
}
