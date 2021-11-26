import React from "react";
import { StatusBar, Platform, Image, Alert, StyleSheet, View, } from "react-native";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },

  content: {
    flex: 1,
    backgroundColor: '#28a745',
  },
});
export default MyStatusBar;