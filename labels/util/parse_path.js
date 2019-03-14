// Components that have multiple files that are not integrations
var entityComponent = [
  'air_quality',
  'alarm_control_panel',
  'automation',
  'binary_sensor',
  'calendar',
  'camera',
  'climate',
  'cover',
  'device_tracker',
  'fan',
  'geo_location',
  'image_processing',
  'light',
  'lock',
  'mailbox',
  'media_player',
  'notify',
  'remote',
  'scene',
  'sensor',
  'switch',
  'tts',
  'vacuum',
  'water_heater',
  'weather',
];

var coreComponents = entityComponent.concat([
  'alexa',
  'api',
  'auth',
  'cloud',
  'config',
  'configurator',
  'conversation',
  'counter',
  'default_config',
  'demo',
  'discovery',
  'ffmpeg',
  'frontend',
  'google_assistant',
  'group',
  'hassio',
  'history',
  'http',
  'input_boolean',
  'input_datetime',
  'input_number',
  'input_select',
  'input_text',
  'introduction',
  'ios',
  'logbook',
  'logger',
  'lovelace',
  'map',
  'mobile_app',
  'mqtt',
  'onboarding',
  'panel_custom',
  'panel_iframe',
  'persistent_notification',
  'person',
  'recorder',
  'script',
  'scene',
  'shell_command',
  'shopping_list',
  'stream',
  'sun',
  'system_health',
  'system_log',
  'timer',
  'updater',
  'webhook',
  'weblink',
  'websocket_api',
  'zone',
]);

var coreComponentPlatforms = [
  'automation',
  'demo',
  'mqtt',
];

module.exports = function(path) {
  const parts = path.split('/');

  // filter out all but the src
  if (parts.shift() !== 'homeassistant') return null;

  const result = {
    path,
    core: false,
    type: null,
    component: null,
    platform: null,
  };

  const subfolder = parts.shift();

  if (subfolder !== 'components') {
    result.core = true;

    if (subfolder.endsWith('.py')) {
      result.type = 'core';
    } else {
      result.type = subfolder;
    }
    return result;
  }

  if (parts.length == 1) {
    if (parts[0] === 'services.yaml') {
      result.type = 'services';
    } else if (parts[0] === '__init__.py') {
      result.core = true;
      result.type = 'core'
    } else {
      result.type = 'component';
      result.component = parts[0].replace('.py', '');
    }
    return result;
  }

  result.component = parts.shift();

  if (parts[0] === 'services.yaml') {
    result.type = 'services'
  } else if (parts[0] == '__init__.py') {
    result.type = 'component';
  } else if (!entityComponent.includes(result.component) && 
      !entityComponent.includes(parts[0].replace('.py', ''))) {
    result.type = 'component';
  } else if (entityComponent.includes(parts[0].replace('.py', ''))) {
    result.type = 'platform';
    result.platform = result.component;
    result.component = parts[0].replace('.py', '');
  } else {
    result.type = 'platform';
    result.platform = parts[0].replace('.py', '');
  }

  if (coreComponents.includes(result.component)) {
    if (result.type !== 'platform' && result.type !== 'services'
        || !entityComponent.includes(result.component)) {
      result.core = true;
    } else if (result.type === 'platform'
        && coreComponentPlatforms.includes(result.component)) {
      result.core = true;
    }
  }
  return result;
}
