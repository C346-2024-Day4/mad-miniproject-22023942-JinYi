import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F0E8',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: '7%',
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    appnameStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 20,
    },
    whitecontainer: {
        height: '91%',
        width: '90%',
        backgroundColor: '#fff',
        marginTop: 15,
        marginLeft: 20,
        borderRadius: 50,
        paddingBottom: 40,
        paddingLeft: 40,
        paddingRight: 40,
    },
    headerStyle: {
        marginTop: 20,
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 30
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    input: {
        flex: 2,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#F8F8F8',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        fontSize: 16,
        backgroundColor: '#F8F8F8',
        width: 200,
    },
    submitButton: {
        alignSelf: 'center',
        marginTop: 20,
        padding: 15,
        paddingRight: 30,
        paddingLeft: 30,
        backgroundColor: '#B3C8CF',
        borderRadius: 40,
        width: '50%',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
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

const AddExpense = ({ navigation, route }) => {
    const { datasource } = route.params;

    const categories = datasource
        .find(section => section.title === 'Expense')
        ?.data.map(item => item.category) || [];

    const [modalVisible, setModalVisible] = useState(false);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);

    const handleSubmit = () => {
        if (category && name && price) {
            const newExpense = {
                key: name,
                amount: parseFloat(price),
            };

            const updatedDatasource = datasource.map((section) => {
                if (section.title === 'Expense') {
                    const updatedData = section.data.map((cat) => {
                        if (cat.category === category) {
                            return {
                                ...cat,
                                items: [...cat.items, newExpense],
                            };
                        }
                        return cat;
                    });
                    return { ...section, data: updatedData };
                }
                return section;
            });

            const updatedCategory = updatedDatasource
                .find((section) => section.title === 'Expense')
                ?.data.find((cat) => cat.category === category);

            navigation.navigate('Expense', {
                category: updatedCategory,
                datasource: updatedDatasource,
            });
        } else {
            alert('Please fill out all fields.');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('./img/icon.png')} style={{ width: 50, height: 50 }} />
                <Text style={styles.appnameStyle}>Expense and Income Manager</Text>
                <Image source={require('./img/userprofile.png')} style={{ width: 50, height: 50 }} />
            </View>

            <View style={styles.whitecontainer}>
                <Text style={styles.headerStyle}>Add Expenses</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Category:</Text>
                    <RNPickerSelect
                        onValueChange={setCategory}
                        items={categories.map(cat => ({ label: cat, value: cat }))}
                        placeholder={{ label: "Select a category", value: null }}
                        style={{inputAndroid: styles.picker}}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter name"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Price:</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholder="Enter price"
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navigatorbarStyle}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Home', { datasource: datasource});
                        }}
                    >
                        <Image source={require('./img/home.png')} style={{ width: 50, height: 50 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Image source={require('./img/add.png')} style={{ width: 50, height: 50 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Charts' , { datasource: datasource});
                        }}
                    >
                        <Image source={require('./img/bar.png')} style={{ width: 45, height: 45 }} />
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

export default AddExpense;
