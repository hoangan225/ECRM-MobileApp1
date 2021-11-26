import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
const RenderRadio = (props) => {
    const {
        value, onChange, selectedValue
    } = props;
    const checked = value === true;
    return (
        <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => onChange(value)}
        >
            <View
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#002451',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: checked ? '#002451' : 'white',
                    }}
                />
            </View>
            <Text style={{ fontSize: 15, marginLeft: 10 }}>{value}</Text>
        </TouchableOpacity>
    );
};

export default RenderRadio;