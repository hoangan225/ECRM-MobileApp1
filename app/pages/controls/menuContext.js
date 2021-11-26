import React, { Component } from 'react';
import { BackHandler, StyleSheet, ScrollView, TouchableWithoutFeedback, Modal, Platform } from "react-native";
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Button, Icon, Title, View } from 'native-base';

class MenuContext extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

      showmenu: false

    };
  }

  render() {
    const { items, open } = this.props;

    if (!open) return null;
    return (
      <Container style={styles.viewList}>
        <Modal
          supportedOrientations={['portrait', 'landscape']}
          animationType="fade"
          // animationType="none"
          onRequestClose={this.props.onRequestClose}
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
            <View style={styles.container}>
              <View style={[styles.actionSheet]}>
                <ScrollView>
                  <View>
                    {
                      items.map((item, key) => {

                        return (
                          <TouchableWithoutFeedback key={key} onPress={item.disable ? () => console.log(item.text) : item.onPress}>
                            <View style={[!!item.divider && styles.menuItemDivider]}>
                              <View style={styles.action}>
                                {item && item.icon}
                                <Text style={[item.disable ? { paddingLeft: 15, fontSize: 16, color: '#999' } : styles.actionText]}>{item.text}</Text>
                              </View>
                            </View>

                          </TouchableWithoutFeedback>
                        )
                      })

                    }
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>

        </Modal >
      </Container >
    );
  }
}


export default MenuContext;

const styles = StyleSheet.create({
  viewList: {
    position: 'absolute',
    elevation: 5,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // backgroundColor: 'rgba(0,0,0,.6)',
  },
  actionSheet: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 5,
    right: 5,
    backgroundColor: '#f9f9f9',
    width: 250,
    borderRadius: 4,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth * 3,
    shadowOffset: {
      height: StyleSheet.hairlineWidth * 3,
    },
  },
  sheet: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  sheetClose: {
    padding: 10
  },
  sheetIcon: {
    fontSize: 26,
    color: '#444',
  },
  sheetInfo: {
    flex: 1,
    paddingLeft: 10,
    minHeight: 50,
    justifyContent: 'center'
  },
  sheetTitle: {
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444'
  },
  actionList: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    flex: 1
  },
  actionCol: {
    flex: 1
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: 40,
    padding: 10
  },
  actionIcon: {
    fontSize: 20,
    color: '#444'
  },
  actionText: {
    paddingLeft: 15,
    fontSize: 16,
    color: '#444'
  },
  menuItemDivider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    borderBottomColor: '#eee',
  },

});