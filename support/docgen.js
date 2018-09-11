/**
 * This script generates the supported devices page.
 * 
 */

const deviceMapping = require('../lib/devstates').devices;
const deviceMappingConverters = require('zigbee-shepherd-converters').devices;
const findByZigbeeModel = require('zigbee-shepherd-converters').findByZigbeeModel;
const fs = require('fs');
const outputdir = process.argv[2];

if (!outputdir) {
    console.error("Please specify an output directory");
}

let file = 'Supported-devices.md';
let text = '*NOTE: Automatically generated by `npm run docgen`* \n \n';

const logDevices = (devices) => {
    let result = '';

    devices = new Map(devices.map((d) => [d.models, d]));
    devices.forEach((device) => {
        var pathImg  = device.icon.replace(new RegExp("img/", "g"), '').replace(new RegExp(".png", "g"), '');      
        device.models.forEach((modelId) => {
            const mappedModel = findByZigbeeModel(modelId);
            const desc = mappedModel ? `${mappedModel.description} (${mappedModel.supports})` : `${modelId}`;
            const brand = mappedModel ? `**${mappedModel.model}**<br>` : ``;
            result += `| ${brand} (${modelId}) | ${desc} |  ![${pathImg}]` + '(https://github.com/ioBroker/ioBroker.zigbee/blob/master/admin/' + `${device.icon}) |\n`;
        });
    });

    return result;
}

const vendors = Array.from(new Set(deviceMapping.map((d) => d.vendor)));
vendors.sort();
text += '|  Model | Description | Picture |\n';
text += '| ------------- | ------------- | -------------------------- |\n';
vendors.forEach((vendor) => {
    text += `|  | **${vendor}**  |   |\n`;   
    text += logDevices(deviceMapping.filter((d) => d.vendor === vendor));
})

fs.writeFileSync(outputdir + '/' + file, text);

