import React, { Component } from 'react';
import lodash from 'lodash';
import {
    StyleSheet, Text, View, Image,
    Modal, TouchableWithoutFeedback
} from 'react-native';
import Toolbar from './toolbars';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
//import Gallery from 'react-native-gallery';

class ImageViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showToolbar: true,
            title: null,
            index: 0
        }
    }

    componentDidMount() {
        this.onPageSelected(this.props.index);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.onPageSelected(newProps.index);
    }

    onTaped = () => {
        this.setState({ showToolbar: !this.state.showToolbar });
    }

    onPageSelected = (index) => {
        const images = this.props.images || [];
        const image = images[index || 0];
        if (!!image) {
            this.setState({
                title: image.substr(image.lastIndexOf('/') + 1) || (index + 1),
                index: index
            });
        }
    }

    render() {
        var images = this.props.images || [];

        images = images.map(item => ({ url: item }));

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                visible={this.props.visible}
                transparent={true}
                animationType="fade"
                onRequestClose={this.props.onRequestClose}>
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.onTaped()}>
                    <View style={{ flex: 1 }}>
                        {
                            this.state.showToolbar &&
                            <Toolbar
                                onIconPress={this.props.onRequestClose}
                                titleText={this.state.title} />
                        }

                        <ImageZoomViewer
                            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.85)' }}
                            index={this.state.index}
                            onChange={this.onPageSelected}
                            imageUrls={images}
                            renderIndicator={() => { }}
                        />

                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

export default ImageViewer;