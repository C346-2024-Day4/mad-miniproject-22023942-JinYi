import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Image, TouchableWithoutFeedback ,TouchableOpacity, TextInput, Modal} from 'react-native';

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
    expenseItem: {
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
    },
    itemName: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },

    itemAmount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    budgetStyle: {
        alignSelf: 'center',
        fontSize: 25,
        fontWeight: 'bold',
    },
    totalcatStyle:{
        borderTopColor: 'black',
        borderTopWidth: 1,
        flexDirection: 'row',
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        justifyContent: 'space-between',
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

const Expense = ({ route, navigation }) => {

    const { category, datasource } = route.params;
    const [modalVisible, setModalVisible] = useState(false);

    const [updatedDatasource, setUpdatedDatasource] = useState(datasource);
    const [budgetInput, setBudgetInput] = useState(category.budget.toFixed(2));
    const [totalAmount, setTotalAmount] = useState(
        category.items.reduce((total, item) => total + item.amount, 0)
    );

    useEffect(() => {
        const expenseSection = updatedDatasource.find((section) => section.title === 'Expense');
        const updatedCategory = expenseSection?.data.find(
            (cat) => cat.category === category.category
        );

        if (updatedCategory) {
            const newTotal = updatedCategory.items.reduce((sum, item) => sum + item.amount, 0);
            setTotalAmount(newTotal);
        }
    }, [updatedDatasource, category.category]);

    const handleDelete = (categoryName, itemKey) => {
        const updatedDataSource = updatedDatasource.map((section) => {
            if (section.title === 'Expense') {
                const updatedItems = section.data.map((category) => {
                    if (category.category === categoryName) {
                        console.log(category.category);
                        console.log(category.items);
                        const updatedItems = category.items.filter(item => item.key !== itemKey);
                        console.log(updatedItems);
                        return { ...category, items: updatedItems };
                    }
                    return category;
                });
                return { ...section, data: updatedItems };
            }
            return section;
        });

        setUpdatedDatasource(updatedDataSource);
    };

    const updateBudget = (newBudget) => {
        const updatedDataSource = updatedDatasource.map((section) => {
            if (section.title === 'Expense') {
                const updatedData = section.data.map((cat) => {
                    if (cat.category === category.category) {
                        return { ...cat, budget: parseFloat(newBudget) || 0 };
                    }
                    return cat;
                });
                return { ...section, data: updatedData };
            }
            return section;
        });

        setUpdatedDatasource(updatedDataSource);
    };

    const updateItem = (itemKey, newKey, newAmount) => {
        const updatedDataSource = updatedDatasource.map((section) => {
            if (section.title === 'Expense') {
                const updatedData = section.data.map((cat) => {
                    if (cat.category === category.category) {
                        const updatedItems = cat.items.map((item) => {
                            if (item.key === itemKey) {
                                return { key: newKey, amount: parseFloat(newAmount) || 0 };
                            }
                            return item;
                        });
                        return { ...cat, items: updatedItems };
                    }
                    return cat;
                });
                return { ...section, data: updatedData };
            }
            return section;
        });

        setUpdatedDatasource(updatedDataSource);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('./img/icon.png')} style={{ width: 50, height: 50 }} />
                <Text style={styles.appnameStyle}>Expense and Income Manager</Text>
                <Image source={require('./img/userprofile.png')} style={{ width: 50, height: 50 }} />
            </View>
            <View style={styles.whitecontainer}>
                <Text style={styles.headerStyle}>{category.key || category.category}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 80, paddingRight: 80, paddingBottom: 10}}>
                    <Text style={styles.budgetStyle}>Budget: </Text>
                    <TextInput
                        style={styles.budgetStyle}
                        value={budgetInput}
                        keyboardType="numeric"
                        onChangeText={setBudgetInput}
                        onEndEditing={(e) => updateBudget(e.nativeEvent.text)}
                    />
                </View>
                <View style={{height: '70%'}}>
                    <FlatList
                        data={category.items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.expenseItem}>
                                <TouchableOpacity onPress={() => handleDelete(category.category, item.key)}>
                                    <Image source={require('./img/delete.png')} style={{ height: 50, width: 50 }} />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.itemName}
                                    defaultValue={item.key}
                                    onEndEditing={(e) => updateItem(item.key, e.nativeEvent.text, item.amount)}
                                />
                                <TextInput
                                    style={styles.itemAmount}
                                    defaultValue={item.amount.toFixed(2)}
                                    keyboardType="numeric"
                                    onEndEditing={(e) => updateItem(item.key, item.key, parseFloat(e.nativeEvent.text) || 0)}
                                />
                            </View>
                        )}
                    />

                </View>
                <View style={styles.totalcatStyle}>
                    <Text style={styles.budgetStyle}>Total</Text>
                    <Text style={styles.budgetStyle}>${totalAmount.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.navigatorbarStyle}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Home', { datasource: updatedDatasource });
                    }}>
                        <Image source={require('./img/home.png')} style={{ width: 50, height: 50 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Image source={require('./img/add.png')} style={{ width: 50, height: 50 }}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Charts', { datasource: datasource });
                        }}
                    >
                        <Image source={require('./img/bar.png')} style={{ width: 45, height: 45 }}/>
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



export default Expense;
