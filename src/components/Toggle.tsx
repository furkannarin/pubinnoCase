import React from "react";
import { View, Text, ViewStyle, ColorValue, StyleProp, TextStyle, TouchableOpacity } from 'react-native';

import theme from "../theme";

type Props = {
    title: string
    color: ColorValue
    colorSize?: number
    onToggle?: () => unknown
}

const contStyle: ViewStyle = {
    backgroundColor: theme.green[200],
    borderRadius: theme.borders.radius.sq
}

const titleStyle: StyleProp<TextStyle> = {
    color: theme.white,
    fontWeight: theme.font.weight.bold,
    fontSize: theme.font.size.desc,
    marginLeft: 10
}

const Toggle = (props: Props) => {
    const { color, onToggle, colorSize = 15, title = 'GIVE ME TITLE' } = props;

    return (
        <TouchableOpacity activeOpacity={1} onPress={onToggle} style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ ...contStyle, backgroundColor: color, height: colorSize, width: colorSize }}/>
            <Text style={titleStyle}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Toggle;