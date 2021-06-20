import * as d3 from 'd3';

export const handleCSVIinputFile = (result) => {
  const csvData = d3.csvParse(result);
  for (const val in csvData) {
    for (const item in csvData[val]) {
      if (item.includes('_num')) {
        csvData[val][item] = parseFloat(csvData[val][item]);
        if (item == 'automation_rate_num') {
          csvData[val]['automation_rate'] = parseFloat(csvData[val][item]);
        }
      }
    }
  }
  return csvData;
};

export const handleJSONIinputFile = (result) => {
  const jsonData = JSON.parse(result);
  return jsonData;
};
