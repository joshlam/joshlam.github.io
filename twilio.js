const camelCase = require('camelcase');
const Twilio = require('twilio');

const config = require('./config');

let lastRequestTime = Date.now();

// Convert keys to camelCase to conform with the twilio-node api definition contract
function camelCaseKeys(hashmap) {
  const newhashmap = {};

  Object.keys(hashmap).forEach(key => {
    const newkey = camelCase(key);

    newhashmap[newkey] = hashmap[key];
  });

  return newhashmap;
};

/**
 * Create a device binding from a POST HTTP request
 *
 * @param {Object} binding
 *
 * @return {Promise}
 *         {Object.status}
 *         {Object.data}
 *                {Object.message}
 */
exports.registerBind = function registerBind(binding) {
  const service = getTwilioClient();

  return service.bindings.create(camelCaseKeys(binding)).then(binding => {
    console.log(binding);
    // Send a JSON response indicating success
    return {
      status: 200,
      data: {message: 'Binding created!'},
    };
  }).catch(error => {
    console.log(error);

    return {
      status: 500,
      data: {
        error: error,
        message: `Failed to create binding: ${error}`,
      },
    };
  });
};

// Notify - send a notification from a POST HTTP request
exports.sendNotification = function sendNotification(notification, bypass = false) {
  const timeSinceLastRequest = Date.now() - lastRequestTime;

  if (timeSinceLastRequest > 7200000 && timeSinceLastRequest < 25200000 && !bypass) return;

  // Create a reference to the user notification service
  const service = getTwilioClient();

  // Send a notification
  return service.notifications.create(camelCaseKeys(notification)).then(message => {
    console.log(message);

    return {
      status: 200,
      data: {message: 'Successful sending notification'},
    };
  }).catch((error) => {
    console.log(error);

    return {
      status: 500,
      data: {error: error},
    };
  });
};

function getTwilioClient() {
  // Twilio Library
  const client = new Twilio(
    config.TWILIO_API_KEY,
    config.TWILIO_API_SECRET,
    { accountSid: config.TWILIO_ACCOUNT_SID }
  );

  // Get a reference to the user notification service instance
  const service = client.notify.services(
    config.TWILIO_NOTIFICATION_SERVICE_SID
  );

  return service;
}

exports.setLastRequestTime = function setLastRequestTime(time) {
  lastRequestTime = time;
}
