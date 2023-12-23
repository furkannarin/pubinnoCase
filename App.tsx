import dataHelpers, { DataTypes } from './src/data';

import React, { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';

import { View, Text, StatusBar, StyleProp, TextStyle, ScrollView, Modal } from 'react-native';
import { Toggle, Input } from './src/components';

import theme from './src/theme';
import styles from './src/styles';

import { InputTypes } from './src/components/Input';
import { DateRange, GraphDateRange, LocDataGraphData } from './src/data/data.d';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';

const { bestTitleStyle, dateTextStyle, headerTextStyle, selectionTextStyle, toggleContStyle } = styles;
const { getStructuredData, structureData, locationNames, createLineGraphData, createLocGraphData } = dataHelpers;

structureData();
const data = getStructuredData();

enum Location { First, Second };

type SelectedLocs = null | {
  loc1: string
  loc2: string
}

const constructDate = (startDate: DateRange, endDate: DateRange): GraphDateRange => ({
  start: Date.parse(startDate.year + '-' + startDate.month + '-' + startDate.day),
  end: Date.parse(endDate.year + '-' + endDate.month + '-' + endDate.day)
})

const App = () => {
  const [startDate, setStartDate] = useState<DateRange>({ day: '15', month: '10', year: '2023' });
  const [endDate, setEndDate] = useState<DateRange>({ day: '16', month: '10', year: '2023' });
  const [totalData, setTotalData] = useState<LineChartData | null>(null);
  
  const [locSpecificData, setlocSpecificData] = useState<LocDataGraphData>(null);
  const [comparisonFilter, setFilter] = useState<DataTypes>(DataTypes.LitersSold);

  const [locDate, setLocDate] = useState<DateRange>({ day: '15', month: '10', year: '2023' });
  const [selectedLocs, setSelectedLocs] = useState<SelectedLocs>(null);
  const [modalVisible, setModalVisible] = useState({ visible: false, selection: Location.First });

  useEffect(() => {
    const data = createLineGraphData(constructDate(startDate, endDate));
    if (data) setTotalData(data);
  }, []);

  const handleDateChange = (text: string, type: InputTypes, isStartDate: boolean = false) => {
    if (isStartDate) {
      const newStartDate = { ...startDate, [type]: text };
      setStartDate(newStartDate);
      const data = createLineGraphData(constructDate(newStartDate, endDate));
      if (data) setTotalData(data);
    }
    else {
      const newEndDate = { ...endDate, [type]: text };
      setEndDate(newEndDate);
      const data = createLineGraphData(constructDate(startDate, newEndDate));
      if (data) setTotalData(data);
    }
  };

  const handleLocSelection = (name: string) => {
    if(modalVisible.selection === Location.First) setSelectedLocs(p => ({ loc1: name, loc2: p?.loc2 || '' }));
    if(modalVisible.selection === Location.Second) setSelectedLocs(p => ({ loc2: name, loc1: p?.loc1 || '' }));
    setModalVisible({ visible: false, selection: modalVisible.selection });
  };

  const handleLocDateChange = (text: string, type: InputTypes) => {
    setLocDate(p => ({ ...p, [type]: text }));
  };

  const handleLocComparison = () => {
    if(!selectedLocs) return;
    if(!selectedLocs.loc1 || !selectedLocs.loc2) return;

    const locDateInMS = Date.parse(locDate.year + '-' + locDate.month + '-' + locDate.day);
    const locData = createLocGraphData(locDateInMS, [selectedLocs.loc1, selectedLocs.loc2]);
    setlocSpecificData(locData);
  }

  const filterTextStyle = (current: DataTypes): StyleProp<TextStyle> => ({
    ...selectionTextStyle,
    height: theme.device.height * 0.05,
    width: theme.device.width * 0.25,
    fontSize: theme.font.size.regular,
    borderColor: current === comparisonFilter ? theme.red : theme.gray[700],
    marginVertical: 0
  });

  return (
    <React.Fragment>
      <StatusBar backgroundColor={theme.black} />
      <ScrollView style={{ flex: 1, backgroundColor: theme.black }}>
        <Text style={{ color: theme.white, marginLeft: 10, marginBottom: 5, fontWeight: theme.font.weight.bold }}>Start</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }}>
          <Input onEnd={(text, type) => handleDateChange(text, type, true)} type={InputTypes.day} defaultValue={startDate.day} />
          <Input onEnd={(text, type) => handleDateChange(text, type, true)} type={InputTypes.month} defaultValue={startDate.month} />
          <Input onEnd={(text, type) => handleDateChange(text, type, true)} type={InputTypes.year} defaultValue={startDate.year} />
        </View>

        <Text style={{ color: theme.white, marginLeft: 10, marginBottom: 5, fontWeight: theme.font.weight.bold }}>End</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }}>
          <Input onEnd={handleDateChange} type={InputTypes.day} defaultValue={endDate.day} />
          <Input onEnd={handleDateChange} type={InputTypes.month} defaultValue={endDate.month} />
          <Input onEnd={handleDateChange} type={InputTypes.year} defaultValue={endDate.year} />
        </View>

        <Text style={headerTextStyle}>TOTAL</Text>

        <View style={toggleContStyle}>
          <Toggle color={theme.purple} title='Liters Sold' />
          <Toggle color={theme.red} title={DataTypes.Efficiency} />
          <Toggle color={theme.green[600]} title={DataTypes.Quality} />
        </View>

        {
          totalData &&
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, alignSelf: 'center' }}>
              <LineChart
                data={totalData}
                withVerticalLines={false}
                withShadow={false}
                segments={3}
                fromZero
                width={theme.device.width * 0.95}
                height={theme.device.height * 0.3}
                chartConfig={{
                  backgroundColor: theme.black,
                  backgroundGradientFrom: theme.black,
                  backgroundGradientTo: theme.black,
                  decimalPlaces: 1,
                  strokeWidth: 2,
                  color: () => theme.gray[700],
                  labelColor: () => theme.white,
                  propsForDots: { r: 3 }
                }}
                style={{ justifyContent: 'center', alignItems: 'center' }}
              />
              {
                totalData.labels.map((l, i) =>
                  {
                    const dayData = data[Date.parse(l.replaceAll('.', '-'))];
                    return (
                      <View key={i} style={{ width: theme.device.width * 0.95, marginTop: 10 }}>
                        { i === 0 && <Text style={bestTitleStyle}>BEST</Text>}
                        <Text style={{...dateTextStyle, fontWeight: theme.font.weight.bold, color: theme.gray[700] }}>{l}</Text>
                        <Text style={dateTextStyle}>{dayData.best.brand} | {dayData.best.amount} L</Text>
                        <Text style={dateTextStyle}>{dayData.best.location}</Text>
                      </View>
                    )
                  }
                )
              }
            </View>
        }

        {/* SEPARATOR */}
        <View style={{ width: theme.device.width * 0.9, alignSelf: 'center', height: 2, backgroundColor: theme.gray[700], marginTop: 20 }} />
        {/* SEPARATOR */}

        <Text style={{ ...bestTitleStyle, letterSpacing: 5, marginBottom: 20 }}>COMPARE LOCATIONS</Text>

        <Text style={{ color: theme.white, marginLeft: 15, marginBottom: 10, fontWeight: theme.font.weight.bold }}>Select Day</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }}>
          <Input onEnd={handleLocDateChange} type={InputTypes.day} defaultValue={locDate.day} />
          <Input onEnd={handleLocDateChange} type={InputTypes.month} defaultValue={locDate.month} />
          <Input onEnd={handleLocDateChange} type={InputTypes.year} defaultValue={locDate.year} />
        </View>
        
        <View style={{ ...toggleContStyle, height: theme.device.height * 0.05 }}>
          <Toggle onToggle={() => setModalVisible({ visible: true, selection: Location.First })} colorSize={25} color={theme.red} title={selectedLocs?.loc1 || 'Select Location'} />
          <Toggle onToggle={() => setModalVisible({ visible: true, selection: Location.Second })} colorSize={25} color={theme.white} title={selectedLocs?.loc2 || 'Select Location'} />
        </View>

        {
          locSpecificData &&
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, alignSelf: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginBottom: 10 }}>
                <Text onPress={() => setFilter(DataTypes.Efficiency)} style={filterTextStyle(DataTypes.Efficiency)}>{DataTypes.Efficiency}</Text>
                <Text onPress={() => setFilter(DataTypes.LitersSold)} style={[filterTextStyle(DataTypes.LitersSold), { marginHorizontal: 20 }]}>Liters Sold</Text>
                <Text onPress={() => setFilter(DataTypes.Quality)} style={filterTextStyle(DataTypes.Quality)}>{DataTypes.Quality}</Text>
              </View>
              <LineChart
                data={locSpecificData[comparisonFilter]}
                withVerticalLines={false}
                withShadow={false}
                segments={3}
                fromZero
                width={theme.device.width * 0.95}
                height={theme.device.height * 0.3}
                chartConfig={{
                  backgroundColor: theme.black,
                  backgroundGradientFrom: theme.black,
                  backgroundGradientTo: theme.black,
                  decimalPlaces: 1,
                  strokeWidth: 2,
                  color: () => theme.gray[700],
                  labelColor: () => theme.white,
                  propsForDots: { r: 3 }
                }}
                style={{ justifyContent: 'center', alignItems: 'center' }}
              />
            </View>
        }

        <Text onPress={handleLocComparison} style={selectionTextStyle}>CONFIRM</Text>

        <Modal visible={modalVisible.visible} animationType='fade'>
          <View style={{ backgroundColor: theme.black, flex: 1, justifyContent: 'center' }}>
            {
              locationNames.map((name, i) => <Text onPress={() => handleLocSelection(name)} key={i} style={selectionTextStyle}>{name}</Text>)
            }
          </View>
        </Modal>

      </ScrollView>
    </React.Fragment>
  );
};

export default App;
