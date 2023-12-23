import data from './data.json';
import theme from '../theme';
import { GraphDateRange, LocDataGraphData, LocMap, StructuredData } from './data';

import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

export enum DataTypes {
    Efficiency = 'Efficiency',
    LitersSold = 'LitersSold',
    Quality = 'Quality'
}

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const structuredData: StructuredData = {};
const locationData: LocMap = {};
const locationNames: string[] = [];

const getStructuredData = () => structuredData;

// total cost of this function in iter counts:
// DAY_COUNT * LOCATION_ARRAY_LENGTH
const structureData = () => {
    data.forEach(d => {
        const dayInMS = Date.parse(`${d.year}-${d.month}-${d.day}`);

        structuredData[dayInMS] = {
            total: {
                efficiency: 0,
                litersSold: 0,
                quality: 0
            },
            best: {
                amount: 0,
                brand: '',
                location: ''
            }
        };

        locationData[dayInMS] = {};

        // alias for readability
        const dayObj = structuredData[dayInMS];
        const locDayObj = locationData[dayInMS];

        d.locations.forEach(l => {
            const locationName = l.name;
            if (locationNames.indexOf(locationName) === -1) locationNames.push(locationName);

            l.sold.forEach(i => {

                // if there is a location data at current idx, add to it
                // if not, assign the initial values
                if(locDayObj[locationName]) {
                    locDayObj[locationName] = {
                        efficiency: locDayObj[locationName].efficiency + i.efficiency,
                        quality: locDayObj[locationName].quality + i.quality,
                        sold: locDayObj[locationName].sold + i.sold
                    };
                } else {
                    locDayObj[locationName] = {
                        efficiency: i.efficiency,
                        quality: i.quality,
                        sold: i.sold
                    };
                }

                if (!dayObj.best.brand) {
                    dayObj.best.brand = i.name;
                    dayObj.best.amount = i.sold;
                    dayObj.best.location = locationName
                }

                if (dayObj.best.brand) {
                    const diffBetweenBrands = dayObj.best.amount - i.sold;

                    if (diffBetweenBrands < 0) {
                        dayObj.best.brand = i.name;
                        dayObj.best.amount = i.sold;
                        dayObj.best.location = locationName
                    }
                }

                dayObj.total.efficiency = dayObj.total.efficiency + i.efficiency;
                dayObj.total.litersSold = dayObj.total.litersSold + i.sold;
                dayObj.total.quality = dayObj.total.quality + i.quality;
            })
        })

    })
};

const createLineGraphData = (dates: GraphDateRange): LineChartData | null => {
    const isValidStartDate = structuredData[dates.start];
    const isValidEndDate = structuredData[dates.end];
    
    if (!isValidStartDate || !isValidEndDate) return null;
  
    const availableDates = Object.keys(structuredData);
    const startDateIdx = availableDates.indexOf(String(dates.start));
  
    let totalDays = (dates.end - dates.start) / ONE_DAY_IN_MS;

    const labels: string[] = [];
    const datasets: Dataset[] = [
      { data: [], color: () => theme.purple },
      { data: [], color: () => theme.red },
      { data: [], color: () => theme.green[600] }
    ];
  
    for (let i = startDateIdx; i <= startDateIdx + totalDays; i++) {
      const labelDate = new Date(Number(availableDates[i])).toISOString().slice(0, 10).replaceAll('-', '.');
      labels.push(labelDate);
      datasets[0].data.push(structuredData[availableDates[i]].total.litersSold);
      datasets[1].data.push(structuredData[availableDates[i]].total.efficiency);
      datasets[2].data.push(structuredData[availableDates[i]].total.quality);
    }
  
    return {
      labels,
      datasets
    }
}

const createLocGraphData = (date: number, selectedLocs: string[]): LocDataGraphData => {
    const isValidDate = locationData[date];
    if (!isValidDate) return null;
  
    const qualityDataset: Dataset[] = [{ data: [], color: () => theme.red }, { data: [], color: () => theme.white }];
    const efficiencyDataset: Dataset[] = [{ data: [], color: () => theme.red }, { data: [], color: () => theme.white }];
    const soldDataset: Dataset[] = [{ data: [], color: () => theme.red }, { data: [], color: () => theme.white }];
  
    selectedLocs.forEach((l, i) => {
      qualityDataset[i].data.push(locationData[date][l].quality);
      efficiencyDataset[i].data.push(locationData[date][l].efficiency);
      soldDataset[i].data.push(locationData[date][l].sold);
    })
  
    return {
      Efficiency: { datasets: efficiencyDataset, labels: [''] },
      LitersSold: { datasets: soldDataset, labels: [''] },
      Quality: { datasets: qualityDataset, labels: [''] }
    }
};

export default {
    structureData,
    getStructuredData,
    locationNames,
    createLineGraphData,
    createLocGraphData
}