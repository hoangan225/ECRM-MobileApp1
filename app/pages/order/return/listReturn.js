import React, { Component } from "react";
import moment from "moment";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Platform,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Container, Icon, Spinner } from "native-base";
import { DrawerActions } from "react-navigation-drawer";
import MyStatusBar from "../../statusBar/MyStatusBar";
import Toolbar from "../../controls/toolbars";
import Loading from "../../controls/loading";
import { connect } from "../../../lib/connect";
import * as actions from "../../../actions/product/order";
import { getDetails } from "../../../actions/product/invoice";
import ListItemReturn from "./listItemReturn";
import OrderDetailBox from "./orderBox";

export const typeStatusMapping = {
  return: ["Returned", "Returning", "ConfirmReturned"],
};

class ListReturn extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      search: null,
      loading: false,
      refreshing: false,
      filter: {
        page: 1,
        pagesize: 20,
        status: ["Returned", "Returning", "ConfirmReturned"],
      },
      type: "return",
      currentBox: null,
      currentOrder: null,
    };
  }

  componentDidMount() {
    this.applyFilter();
  }
  refresh = () => {
    this.applyFilter({ page: 1 });
  };

  applyFilter = (filter) => {
    filter = {
      ...this.state.filter,
      ...filter,
      page: (filter && filter.page) || 1,
    };
    this.setState({ loading: true, filter });
    // filter.status = typeStatusMapping[this.state.type]
    this.props.actions
      .getList(filter)
      .then((data) => {
        this.setState({ loading: false });
      })
      .catch(({ message }) => {
        alert(message, "danger");
        this.setState({ loading: false });
      });
  };

  showMenu = () => {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };

  renderItem = ({ item }) => {
    return <ListItemReturn order={item} showBox={this.showBox} />;
  };

  showBox = (idInvoice) => {
    if (idInvoice) {
      this.props.actions.getDetails(idInvoice).then((data) => {
        let order = this.getModel(idInvoice);
        this.setState({
          invoice: data,
          currentBox: true,
          currentOrder: order,
        });
      });
    } else {
      this.setState({
        currentBox: null,
      });
    }
  };

  getModel = (itemId) => {
    if (itemId) {
      return this.props.order.items.find((item) => item.invoice.id == itemId);
    }
    return null;
  };

  handleRefresh = () => {
    this.setState(
      {
        filter: {
          ...this.state.filter,
          page: 1,
          pagesize: 20,
          refreshing: true,
        },
      },
      () => {
        this.refresh();
        this.setState({
          filter: {
            ...this.state.filter,
            page: 1,
            pagesize: 20,
            refreshing: false,
          },
        });
      }
    );
  };

  handleLoadMore = () => {
    var { order } = this.props;
    var { total } = this.props.order;
    if (order.items.length < total) {
      let pagesize = this.state.filter.pagesize;
      this.setState(
        {
          ...this.state,
          canLoadMore: true,
          loading: true,
          filter: {
            ...this.state.filter,
            page: this.state.page,
            pagesize: pagesize + 20,
          },
        },
        this.applyFilter({ pagesize: pagesize })
      );
    } else {
      this.setState({
        canLoadMore: false,
        loading: false,
      });
    }
  };

  renderFooter = () => {
    return (
      <View style={styles.flatlistfooter}>
        {this.state.canLoadMore && <Spinner color="green" />}
        {!this.state.canLoadMore && this.props.order.items.length > 0 ? (
          <Text>{__("Đã load hết dữ liệu")}</Text>
        ) : this.props.order.items.length > 0 ? (
          <Text style={{ color: "red" }}>{__("Đang tải..")}</Text>
        ) : (
              <Text style={{ color: "red" }}>{__("Không có dữ liệu")}</Text>
            )}
      </View>
    );
  };

  render() {
    const navigationState = this.props.navigation.state;
    const lstOrder = this.props.order.items;
    if (!lstOrder) return null;
    const backgroundColor =
      (navigationState.params && navigationState.params.backgroundColor) ||
      "#ffb400";
    return (
      <View style={styles.page}>
        {Platform.OS === "ios" ? (
          <StatusBar
            backgroundColor={backgroundColor}
            barStyle="light-content"
          />
        ) : (
            <MyStatusBar
              backgroundColor={backgroundColor}
              barStyle="light-content"
            />
          )}
        <Toolbar
          noShadow
          icon={
            <Icon
              type="MaterialIcons"
              name="menu"
              style={{ fontSize: 22, color: "#fff" }}
            />
          }
          onIconPress={this.showMenu}
          titleText={__("Danh sách hoàn")}
          style={{ backgroundColor }}
          onPressMore={() => this.showBox({}, "menucontext")}
        ></Toolbar>
        <FlatList
          data={lstOrder}
          renderItem={this.renderItem}
          keyExtractor={(item) => "ID" + item.id}
          refreshControl={
            <RefreshControl
              tintColor="#28cc54"
              title="Loading..."
              titleColor="#00ff00"
              colors={["#28cc54", "#00ff00", "#ff0000"]}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          onEndReached={this.handleLoadMore}
          ListFooterComponent={this.renderFooter()}
        />
        {this.state.currentBox && (
          <OrderDetailBox
            show={this.state.currentOrder != null}
            box={this.state.currentBox}
            entry={this.state.currentOrder}
            invoice={this.state.invoice}
            onRequestClose={() => this.showBox(null)}
          />
        )}
      </View>
    );
  }
}

export default connect(
  ListReturn,
  (state) => ({
    order: state.order,
    invoice: state.invoice,
  }),
  { ...actions, getDetails }
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  logo: {
    width: 300,
    height: 130,
    marginBottom: 40,
  },
  text: {
    color: "#28cc54",
    marginTop: 50,
  },
  title: {
    flexDirection: "row",
    margin: 20,
    height: 40,
  },
  flatlistfooter: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  customerProp: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  icon: {
    marginTop: 3,
    fontSize: 14,
    color: "#444",
  },
  value: {
    fontSize: 15,
    color: "#555",
    marginLeft: 10,
    fontWeight: "bold",
  },
  wrap: {
    alignItems: "center",
    paddingTop: 100,
    flex: 1,
  },
  hintText: {
    marginVertical: 10,
    color: "#ccc",
  },
});
