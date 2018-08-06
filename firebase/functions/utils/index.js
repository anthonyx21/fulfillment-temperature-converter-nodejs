function loadHandlersToIntentMap(handlers, intentMap) {
  for (var intentName in handlers) {
    intentMap.set(intentName, handlers[intentName])
  }
  return intentMap
}

module.exports = {
  loadHandlersToIntentMap
}
