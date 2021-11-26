import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';
import { Icon } from 'native-base';

class CouponStatus extends React.Component {
    constructor(props) {
        super(props);
        this.initState();
        this.status = [
            { id: 1, name: __('Còn hạn'), color: '#008000', icon: 'dot-circle-alt' },
            { id: 2, name: __('Mã đã hết hạn'), color: '#FF0000', icon: 'dot-circle-alt' },
            { id: 3, name: __('Mã đã sử dụng'), color: '#f5dd04', icon: 'check-circle' }
        ];
    }

    initState = () => {
        this.state = {
            discount: this.props.discount || 0,
            isPrice: this.props.isPrice || true,
        }
    }

    onClick = () => {
        if (!!this.props.onClick)
            this.props.onClick();
    }

    render() {
        const { expiryDate, exchangeDate, type, button } = this.props;
        var id = 1; //còn hạn

        if (exchangeDate) {
            id = 3;//đã đổi
        }
        else if (expiryDate) {
            var date = moment(expiryDate)
            var now = moment();
            if (now > date) {
                id = 2;//quá hạn
            }
        }
        var status = this.status[id - 1];
        if (!status) return null;
        if ((!!button) && id == 1) {
            return (
                <TouchableOpacity onPress={() => this.onClick()} style={{ paddingVertical: 10, paddingHorizontal: 15, backgroundColor: "#2196f3" }}>
                    <Text style={{ color: "#fff" }}>Sử dụng</Text>
                </TouchableOpacity>
            );
        }
        return (
            <View>
                {(!type || type == 'circle') && (
                    <View>
                        <Text style={{ color: status.color }}>{status.name}</Text>
                    </View>
                )}
            </View>
        )
    }
}


CouponStatus.propTypes = {
    color: PropTypes.oneOf([null, 'red', 'blue', 'green', 'amber', 'cyan', 'purple']),
    type: PropTypes.oneOf([null, 'circle', 'badge']),
    className: PropTypes.string,
};

export default CouponStatus;