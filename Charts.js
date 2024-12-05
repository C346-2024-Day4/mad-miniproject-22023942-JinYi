import React, {useState, useRef} from 'react';
import {
    StatusBar,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    TextInput,
    TouchableWithoutFeedback, Modal, ScrollView
} from 'react-native';
import { BarChart } from "react-native-chart-kit";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F0E8',
    },
    headerStyle: {
        marginTop: 20,
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 30
    },
    whitecontainer: {
        height: '91%',
        width: '90%',
        backgroundColor: '#fff',
        marginTop: 15,
        marginLeft: 20,
        borderRadius: 50,
        paddingBottom: 40
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        height: '7%',
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    appnameStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 20,
    },
    navigatorbarStyle: {
        backgroundColor: '#fff',
        height: 70,
        width: '100%',
        position: 'absolute',
        bottom: -10,
        padding: 10,
        paddingLeft: 40,
        paddingRight: 40,
    },
    typeofchartStyle: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
    },
    modalContent: {
        marginTop: '157%',
        borderWidth: 1.5,
        backgroundColor: 'white',
        width: '50%',
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20,
    },
    modalOption: {
        padding: 20,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    divider: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

const Charts = ({ navigation, route }) => {

    const { datasource } = route.params;
    const [modalVisible, setModalVisible] = useState(false);

    const calculateTotal = (type) => {
        const category = datasource.find((data) => data.title === type);
        if (!category) return 0;

        if (type === "Expense") {
            return category.data.reduce((sum, entry) => {
                return sum + entry.items.reduce((itemSum, item) => itemSum + item.amount, 0);
            }, 0);
        }   else {
            return category.data.reduce((sum, item) => sum + item.amount, 0);
        }
    };

    const totalIncome = calculateTotal("Income");
    const totalExpense = calculateTotal("Expense");

    const monthlytotal = [1200, 1360, 1300, 1520, totalExpense.toFixed(2)];
    const monthlyincome = [2200, 2000, 2400, 2100, totalIncome.toFixed(2)];

    return (
        <View style={styles.container}>
            <StatusBar />
            <View style={styles.header}>
                <Image source={require('./img/icon.png')} style={{ width: 50, height: 50 }} />
                <Text style={styles.appnameStyle}>Expense and Income Manager</Text>
                <Image source={require('./img/userprofile.png')} style={{ width: 50, height: 50 }} />
            </View>
            <View style={styles.whitecontainer}>
                    <Text style={styles.headerStyle}>Charts</Text>
                <ScrollView style={{paddingTop: 20}}>
                    <Text style={styles.typeofchartStyle}>Monthly Spending Chart</Text>
                    <BarChart
                        data={{
                            labels: ["July", "Aug", "Sep", "Oct", "Nov"],
                            datasets: [
                                {
                                    data: monthlytotal,
                                },
                            ],
                            barPercentage: 0.7,

                        }}
                        width={Dimensions.get('window').width * 0.9}
                        height={300}
                        chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            barPercentage: 0.7,
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        fromZero={true}
                        showBarTops={true}
                        withInnerLines={false}
                        showValuesOnTopOfBars={true}
                    />
                    <Text style={styles.typeofchartStyle}>Monthly Income Chart</Text>
                    <BarChart
                        data={{
                            labels: ["July", "Aug", "Sep", "Oct", "Nov"],
                            datasets: [
                                {
                                    data: monthlyincome,
                                },
                            ],
                            barPercentage: 0.7,

                        }}
                        width={Dimensions.get('window').width * 0.9}
                        height={300}
                        chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            barPercentage: 0.7,
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        fromZero={true}
                        showBarTops={true}
                        withInnerLines={false}
                        showValuesOnTopOfBars={true}
                    />
                </ScrollView>
            </View>
            <View style={styles.navigatorbarStyle}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Home', {
                            datasource: datasource,
                        });
                    }}>
                        <Image source={require('./img/home.png')} style={{ width: 50, height: 50 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true);
                    }}>
                        <Image source={require('./img/add.png')} style={{ width: 50, height: 50 }}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Charts');
                    }}>
                        <Image source={require('./img/barpressed.png')} style={{ width: 45, height: 45 }}/>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate('AddExpense', { datasource: datasource });
                                }}
                            >
                                <Text style={styles.modalText}>Add Expenses</Text>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate('AddIncome', { datasource: datasource });
                                }}
                            >
                                <Text style={styles.modalText}>Add Income</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};
export default Charts;
