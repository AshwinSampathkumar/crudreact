import React, {Component} from 'react';
var {
    StyleSheet,
    ListView,
    View,
    Text,
    ActivityIndicator, TouchableHighlight, ActionSheetIOS, TouchableWithoutFeedback
} = require('react-native');

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ReduxActions from '../actions'; //Import your actions

import {Actions} from 'react-native-router-flux';
import ActionSheet from 'react-native-actionsheet';




let options = [ 'Edit', 'Delete', 'Cancel'];
 
const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 2;

var _this;


class Home extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds: ds,
            quotes: [],
            selectedQuote: ''
        };
        this.handlePress = this.handlePress.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)
    }
    showActionSheet(quote) {
        this.ActionSheet.show();
        this.state.selectedQuote = quote;
    }

    handlePress(buttonIndex) {
        if (buttonIndex === 0) Actions.new_quote({quote: this.state.selectedQuote, edit: true, title: "Edit Quote"});
        else if (buttonIndex === 1) _this.props.deleteQuote(this.state.selectedQuote.id);
    }

    componentDidMount() {
        this.props.getQuotes();
        _this = this;
    }
    componentWillReceiveProps(nextprops) {
        const { quotes } = nextprops
        console.log('willRec ', quotes)
        this.setState({ quotes })
    }

    render() {
        if (this.props.loading) {
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator
                        animating={true}
                        style={[{height: 80}]}
                        size="small"
                    />
                </View>
            );
        } else {
            return (
                <View style={{flex: 1, backgroundColor: '#eaeaea'}}>
                    <ListView enableEmptySections={true}
                              dataSource={this.state.ds.cloneWithRows(this.props.quotes)}
                              renderRow={this.renderRow.bind(this)}/>
                    
                    <TouchableHighlight style={styles.addButton}
                                        underlayColor='#ff7043' onPress={() => Actions.new_quote()}>
                        <Text style={{fontSize: 25, color: 'white'}}>+</Text>
                    </TouchableHighlight>
                </View>
            );
        }
    }

    renderRow(rowData) {
        return (
        <View>
            <TouchableWithoutFeedback onPress={() => this.showActionSheet(rowData)}>
                <View style={styles.row}>
                    <Text style={styles.description}>
                        {rowData.quote}
                    </Text>
                    <Text style={styles.author}>
                        {rowData.author}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
            <ActionSheet
            ref={o => this.ActionSheet = o}
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX}
            onPress={this.handlePress}
        />
        </View>
        )
    }


};

function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
        quotes: state.dataReducer.quotes
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(ReduxActions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Home);

var styles = StyleSheet.create({
    activityIndicatorContainer: {
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },

    row: {
        backgroundColor: "#fff",
        padding: 8 * 2,
        marginBottom: 1
    },

    author: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 8 * 2
    },

    quote: {
        marginTop: 5,
        fontSize: 14,
    },

    addButton: {
        backgroundColor: '#ff5722',
        borderColor: '#ff5722',
        borderWidth: 1,
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0
        }
    }
});