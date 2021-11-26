import React, { Component } from 'react';
import moment from 'moment';
import {
    StyleSheet, View, TextInput, Modal
} from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Icon } from 'native-base';

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

        };
    }

    render() {
        return (
            <Container>
                <Content>
                    <List>
                        {
                            this.props.logs && this.props.logs.length > 0 &&
                            this.props.logs.map((log, index) => (
                                <ListItem avatar key={index}>
                                    <Body>
                                        <Text>{log.action == 5 || log.action == 1 ? JSON.parse(log.content).Content : log.content}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{moment(log.time).format("L HH:mm")}</Text>
                                    </Right>
                                </ListItem>
                            )
                            )}

                    </List>
                </Content>
            </Container>
        );
    }
}

export default History;