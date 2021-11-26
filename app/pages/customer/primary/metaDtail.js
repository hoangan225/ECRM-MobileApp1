import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { View, Text, CheckBox, Radio, Icon } from 'native-base';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/customer';
import * as models from '../../../constants/model';

// import MetaField from '../customview/metadatafield';
class Meta extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            model: {
            },
            loading: false
        }
    }



    render() {
        return (
            <View>
                <View>
                    {this.renderField()}
                </View>
            </View>
        );
    }

    getModel = (forModel) => {
        var model = [];
        if (forModel.match(/^Product/)) {
            model = models.Product;
        }
        else {
            model = models[forModel];
        }
        return [...model];
    }


    renderField = () => {
        if (!this.props.fieldName) {
            return null;
        }
        var fieldType = [];
        if (this.props.isMeta) {
            fieldType = this.props.customField.items.filter(t => t.name == this.props.fieldName && t.applyFor == this.props.applyFor);
        }
        else {
            fieldType = this.getModel(this.props.applyFor).map((item, index) => (
                {
                    applyFor: this.props.applyFor,
                    name: item.name,
                    label: item.label,
                    type: item.type,
                    isReadOnly: item.isReadOnly,
                    order: item.order,
                    required: item.required,

                })).filter(t => t.name == this.props.fieldName && t.applyFor == this.props.applyFor);
        }

        if (fieldType && fieldType.length > 0) {
            // // console.log(fieldType);
            var myObject = this.props.defaultValue;
            if (!myObject) return null;
            Object.keys(myObject);
            return (
                <View>
                    <View style={styles.customerProp}>
                        <Icon type="MaterialIcons" name="add" style={styles.icon} />
                        <Text style={styles.value}>{fieldType[0].label}:</Text>
                        <Text style={styles.value}>{myObject[fieldType[0].name]}</Text>
                        {

                            // Object.keys(myObject).map(function (key, index) {
                            //     // console.log(myObject[key]);
                            //     return <Text style={styles.value}>{myObject[fieldType[0].name]}</Text>
                            // })
                        }
                    </View>


                </View>
            )
        }


    }


}


export default connect(Meta, state => ({
    customer: state.customer,
    customField: state.customField,
    fields: state.app.fields,
    status: state.app.enums.customerStatus,
    gender: state.app.enums.gender,
    fieldType: state.app.enums.fieldType,
}), actions);


const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    icon: {
        fontSize: 22,
        color: '#fff'
    },
    customer: {
        flex: 1,
    },
    customerIcon: {
        position: 'relative',
        opacity: 0.8,
    },
    avatarContainer: {
        backgroundColor: '#81C784',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 15,
        paddingLeft: 15
    },
    // avatar: {
    //     width: 80,
    //     height: 80,
    //     borderRadius: 50,
    //     margin: 10,
    //     borderWidth: StyleSheet.hairlineWidth,
    //     borderColor: '#ccc'
    // },
    Avatar: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',

    },
    AvatarText: {
        color: '#fff',
        fontSize: 35
    },
    AvatarBackground: {
        backgroundColor: '#900',
    },
    customerIconText: {
        width: 80,
        height: 80,
        borderRadius: 50,
        margin: 10,
        color: '#fff',
        fontSize: 52,
        textAlign: 'center',
        paddingTop: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
    customerInfo: {
        flex: 1,
        padding: 10,
    },
    customerTitle: {
        color: '#fff',
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    prop: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    label: {
        // width: 110,
        width: 95,
        fontWeight: 'bold',
        marginTop: 5,
        paddingRight: 5
    },
    textbox: {
        flex: 1,
        height: 40,
        padding: 4,
        margin: 0,
        backgroundColor: '#f9f9f9'
    },
    textarea: {
        minHeight: 40,
        height: null,
        textAlignVertical: 'top',
        fontSize: 16
    },
    select: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    customerProp: {
        flexDirection: 'row',
        paddingVertical: 6,
    },
    icon: {
        marginTop: 3,
        fontSize: 14,
        color: '#444'
    },
    value: {
        fontSize: 15,
        color: '#555',
        marginLeft: 10
    },
});