import * as d3 from 'd3';
import { SVG } from '../constants';
import { subtractDays, addDays, organizeDataPlots } from './helpers';

export const createScale = (scaleType, domain, range) => {
  switch (scaleType) {
    case 'linear':
      return d3.scaleLinear().domain(domain).range(range);

    case 'band':
      return d3.scaleBand().domain(domain).range(range);

    case 'time':
      return d3.scaleTime().domain(domain).range(range);

    case 'point':
      return d3.scalePoint().domain(domain).range(range);

    case 'ordinal':
      return d3.scaleOrdinal().domain(domain).range(range);
  }
};

export const createScalesAndFormats = (config, data, ifAxisScale) => {
  const { dataPlots, xFormat, yFormat } = config;
  const { xVals, yVals } = organizeDataPlots(dataPlots);

  return {
    x: createScaleAndFormat(xFormat, data, xVals, true, ifAxisScale),
    y: createScaleAndFormat(yFormat, data, yVals, false, ifAxisScale),
  };
};

export const createScaleAndFormat = (type, data, keys, ifXAxis, ifAxisScale) => {
  const { MARGIN: margin, HEIGHT: height, WIDTH: width } = SVG;
  let range;

  if (ifXAxis) {
    range = [margin.left, width - margin.right];
  } else {
    if (type === 'linear' && !ifAxisScale) {
      range = [0, height];
    } else {
      range = [height + margin.top, margin.top];
    }
  }

  const { formatter, domain } = findDomainAndFormat(type, data, keys);

  if (type === 'percent') type = 'linear';
  const scale = createScale(type, domain, range);

  return { scale, formatter };
};

export const findDomainAndFormat = (type, data, keys) => {
  switch (type) {
    case 'time':
      return findTimeDomain(data, keys);

    case 'percent':
      return { domain: [0, 1] };

    case 'linear':
      return { domain: findLinearDomainWithBuffer(data, keys) };

    case 'band': {
      return {
        domain: [
          ...new Set(
            data.reduce((acc, curr) => {
              keys.forEach((key) => acc.push(curr[key]));
              return acc;
            }, [])
          ),
        ],
      };
    }

    case 'point':
      return {
        domain: data.reduce((acc, curr) => {
          keys.forEach((key) => acc.push(curr[key]));
          return acc;
        }, []),
      };

    default:
      return 'type not found';
  }
};

export const findTimeDomain = (data, keys) => {
  const dates = data.reduce((acc, curr) => {
    keys.forEach((key) => acc.push(new Date(curr[key])));
    return acc;
  }, []);

  const datesExtent = d3.extent(dates);
  datesExtent[0] = subtractDays(datesExtent[0], 1);
  datesExtent[1] = addDays(datesExtent[1], 1);

  return { domain: datesExtent, formatter: tickDateFormatter(data, keys[0]) };
};

export const findLinearDomainWithBuffer = (data, keys) => {
  const combinedData = data.reduce((acc, curr) => {
    keys.forEach((key) => acc.push(curr[key]));
    return acc;
  }, []);
  const extent = d3.extent(combinedData);
  extent[0] *= 0.9;
  extent[1] *= 1.1;
  return extent;
};

export const tickDateFormatter = (data, key) => {
  const dateInputFormat = data[0][key];

  switch (true) {
    case /^[0-3]?[0-9]\/[0-3]?[0-9]\/(?:[0-9]{2})?[0-9]{2}$/.test(dateInputFormat):
      return d3.timeFormat('%b %d, %Y');

    case /^\d{4}$/.test(dateInputFormat):
      return d3.timeFormat('%Y');

    default:
      return d3.timeFormat('%b %Y');
  }
};
