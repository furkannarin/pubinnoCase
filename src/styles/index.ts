import { ViewStyle, StyleProp, TextStyle } from 'react-native';
import theme from '../theme';

const { borders, device, font } = theme;

const toggleContStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: device.height * 0.025
}
  
const headerTextStyle: StyleProp<TextStyle> = {
    alignSelf: 'center',
    color: theme.white,
    fontWeight: font.weight.bold,
    marginTop: 20,
    fontSize: font.size.title + 5,
    letterSpacing: 55
};

const bestTitleStyle: StyleProp<TextStyle> = {
    alignSelf: 'flex-start',
    color: theme.white,
    fontWeight: font.weight.bold,
    marginTop: 20,
    left: 10,
    fontSize: font.size.header,
    letterSpacing: 10
};

const dateTextStyle: StyleProp<TextStyle> = {
    alignSelf: 'flex-start',
    color: theme.white,
    fontWeight: font.weight.regular,
    left: 15,
    fontSize: font.size.desc,
};

const selectionTextStyle: StyleProp<TextStyle> = {
    height: device.height * 0.1,
    width: device.width * 0.3,
    alignSelf: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    color: theme.white,
    fontWeight: font.weight.bold,
    fontSize: font.size.subheader,
    marginVertical: 10,
    borderRadius: borders.radius.sq,
    borderWidth: borders.width.regular,
    borderColor: theme.gray[700]
};

export default {
    toggleContStyle,
    headerTextStyle,
    bestTitleStyle,
    dateTextStyle,
    selectionTextStyle
}