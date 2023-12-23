import { TextStyle, Dimensions } from "react-native";

export default {
    purple: '#4318BE',
    gray: {
      200: '#D2D4DA',
      700: '#404252',
      900: '#101223'
    },
    green: {
      200: '#A5D5DB',
      600: '#00464E'
    },
    yellow: '#FFF3DD',
    white: '#FFFFFF',
    black: '#000000',
    red: '#DC3333',
    borders: {
      radius: {
        circle: 100,
        sq: 4
      },
      width: {
        regular: 1,
        thick: 1.5,
        thin: 0.6
      }
    },
    font: {
      weight: {
        bold: '700' as TextStyle['fontWeight'],
        regular: '400'  as TextStyle['fontWeight']
      },
      size: {
        desc: 10,
        regular: 14,
        subheader: 18,
        header: 22,
        title: 26
      }
    },
    device: {
      height: Dimensions.get('screen').height,
      width: Dimensions.get('screen').width,
    }
};
  