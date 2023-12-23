import React, { useState } from "react";
import { TextInput, Text, View, NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';

import theme from "../theme";

export enum InputTypes { 'year' = 'year', 'month' = 'month', 'day' = 'day' }

type Props = {
    type: InputTypes
    defaultValue: string
    onEnd: (text: string, type: InputTypes, ...args: any[]) => unknown
}

const Input = (props: Props) => {
    const { onEnd, type, defaultValue } = props;
    const [ hasError, setHasError ] = useState(false);

    const maxLength = (() => {
        if(type === InputTypes.year) return 4;
        return 2;
    })();

    const handleEnd = (e: NativeSyntheticEvent<TextInputEndEditingEventData> ) => {
        const val = Number(e.nativeEvent.text);
        if(!val) return;

        const invalidDay = type === InputTypes.day && (val > 31 || val < 1);
        const invalidMonth = type === InputTypes.month && (val > 12 || val < 1);
        const invalidYear = type === InputTypes.year && (val > 2023 || val < 1950);

        if(invalidDay || invalidMonth || invalidYear) {
            setHasError(true);
            return;
        }

        setHasError(false);
        onEnd(e.nativeEvent.text, type);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: hasError ? theme.red : theme.white }}>{type.toUpperCase()}</Text>
            <TextInput
                maxLength={maxLength}
                onEndEditing={handleEnd}
                defaultValue={defaultValue}
                keyboardType='number-pad'
                style={{
                    borderColor: hasError ? theme.red : theme.gray[200],
                    borderRadius: theme.borders.radius.sq,
                    borderWidth: theme.borders.width.regular,
                    height: 40,
                    width: theme.device.width * 0.2,
                    textAlign: 'center',
                    fontWeight: theme.font.weight.bold,
                    color: theme.white
                }}
            />
        </View>
    )
}

export default Input;