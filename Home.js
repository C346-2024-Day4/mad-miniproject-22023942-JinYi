import React, {useState, useRef, useEffect} from 'react';
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
    TouchableWithoutFeedback, Modal
} from 'react-native';
import { BarChart } from "react-native-chart-kit";

import {datasource as initialDatasource} from "./Data";


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
    sectionHeader:{
        fontSize: 24,
        fontWeight: 'bold',
    },
    textStyle:{
        fontWeight: 'bold',
        paddingBottom: 10,
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        gap: 20,
        paddingTop: 10,
        paddingBottom:20
    },
    barandtextStyle: {
        flexDirection: 'column',
    },
    sliderContainer: {
        width: 250,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
        flexDirection: 'row',
    },
    filled: {
        height: '100%',
    },
    empty: {
        flex: 1,
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
    amountandcatStyle: {
        display: 'flex',
        flexDirection: 'row',
    },
    amountStyle: {
        flex: 1,
        right: -75,
        fontWeight: 'bold',

    },
    incomecontainerStyles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
    },

    incomekeyStyle: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },

    incomeamtStyle: {
        fontSize: 20,
        fontWeight: 'bold',
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

const Home = ({ navigation, route }) => {

    const [datasource, setDatasource] = useState(initialDatasource);
    const typingTimeoutRef = useRef(null);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (route.params?.datasource) {
            setDatasource(route.params.datasource);
        }
    }, [route.params]);

    const calculateTotal = (type) => {
        const category = datasource.find((data) => data.title === type);
        if (!category) return 0;

        if (type === "Expense") {
            return category.data.reduce((sum, entry) => {
                return sum + entry.items.reduce((itemSum, item) => itemSum + item.amount, 0);
            }, 0);
        } else {
            return category.data.reduce((sum, item) => sum + item.amount, 0);
        }
    };

    const totalIncome = calculateTotal("Income");
    const totalExpense = calculateTotal("Expense");
    const totalamount = totalIncome - totalExpense;

    const monthlytotal = [300, 400, 370, 450, totalamount];

    const renderItem = ({ item, section }) => {
        const amount = item.amount
            ? item.amount
            : item.items && item.items.length > 0
                ? item.items.reduce((sum, subItem) => sum + subItem.amount, 0)
                : 0;

        const budget = item.budget || 0;
        const progress = budget > 0 ? (amount / budget) * 100 : 0;
        const defaultAmount = item.amount || 0;
        const [inputValue, setInputValue] = useState(defaultAmount.toFixed(2));
        const defaultCategory = item.key || "";
        const [categoryInput, setCategoryInput] = useState(defaultCategory);

        const handleChangeText = (text) => {
            setInputValue(text);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                if (/^\d*\.?\d{0,2}$/.test(text)) {
                    updateAmount(parseFloat(text) || 0, section.title, item.key)
                }
            }, 1500);
        };
        const handleEndEditing = (e) => {
            const finalValue = parseFloat(e.nativeEvent.text || "0").toFixed(2);
            setInputValue(finalValue);
            updateAmount(finalValue, section.title, item.key);
        };
        const updateAmount = (newAmount, sectionTitle, itemKey) => {
            const parsedAmount = parseFloat(newAmount);
            if (isNaN(parsedAmount)) return;


            const updatedDatasource = datasource.map((section) => {
                if (section.title === sectionTitle) {
                    const updatedData = section.data.map((item) => {
                        if (item.key === itemKey) {
                            return { ...item, amount: parsedAmount };
                        }
                        return item;
                    });
                    return { ...section, data: updatedData };
                }
                return section;
            });

            setDatasource(updatedDatasource);
        };


        const handleCategoryChange = (text) => {
            setCategoryInput(text);
        };
        const handleEndEditingCategory = (e) => {
            const finalCategory = e.nativeEvent.text.trim();
            setCategoryInput(finalCategory);
            updateCategory(finalCategory, section.title, item.key);
        };
        const updateCategory = (newCategory, sectionTitle, itemKey) => {
            const updatedDatasource = datasource.map((section) => {
                if (section.title === sectionTitle) {
                    console.log(section.title);
                    const updatedData = section.data.map((item) => {
                        if (item.key === itemKey) {
                            console.log(item.key);
                            console.log(newCategory);
                            return { ...item, key: newCategory };
                        }
                        return item;
                    });
                    return { ...section, data: updatedData };
                }
                return section;
            });

            setDatasource(updatedDatasource);
        };


        const handleDelete = (sectionTitle, itemKey) => {
            const updatedDatasource = datasource.map((section) => {
                if (section.title === sectionTitle) {
                    const updatedData = section.data.filter(item => item.key !== itemKey);
                    console.log(updatedData);
                    return { ...section, data: updatedData };
                }
                return section;
            });

            setDatasource(updatedDatasource);
        };


        return (
            <View>
                {section.title === "Expense" ? (
                    <><TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Expense', { category: item , datasource: datasource });
                    }}
                >
                    <View style={styles.itemContainer}>
                        <Image source={item.image ? item.image : null} style={{ width: 50, height: 50 }} />
                        <View style={styles.barandtextStyle}>
                            <View style={styles.amountandcatStyle}>
                                <Text style={styles.textStyle}>{`${item.key || item.category}`}</Text>
                                <Text style={styles.amountStyle}>${amount.toFixed(2)}</Text>
                            </View>
                            <View style={styles.sliderContainer}>
                                <View style={[styles.filled, { backgroundColor: item.color , width: `${Math.min(progress, 100)}%` }]} />
                                <View style={styles.empty} />
                            </View>
                                <Text style={styles.textStyle}>
                                    {progress > 100 ? "Exceeded Budget!" : `Budget: $${budget}`}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    </>
                ) : (
                    <>
                            <View style={styles.itemContainer}>
                                    <View style={styles.incomecontainerStyles}>
                                        <TouchableOpacity onPress={() => handleDelete(section.title, item.key)}>
                                            <Image source={require('./img/delete.png')} style={{ width: 50, height: 50 }} />
                                        </TouchableOpacity>

                                        <TextInput
                                            style={styles.incomekeyStyle}
                                            value={categoryInput}
                                            onChangeText={handleCategoryChange}
                                            onEndEditing={handleEndEditingCategory}
                                        />
                                        <TextInput
                                            style={styles.incomeamtStyle}
                                            value={inputValue}
                                            keyboardType="numeric"
                                            onChangeText={handleChangeText}
                                            onEndEditing={handleEndEditing}
                                        />
                                    </View>

                            </View>
                    </>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar />
            <View style={styles.header}>
                <Image source={require('./img/icon.png')} style={{ width: 50, height: 50 }} />
                <Text style={styles.appnameStyle}>Expense and Income Manager</Text>
                <Image source={require('./img/userprofile.png')} style={{ width: 50, height: 50 }} />
            </View>
            <View style={styles.whitecontainer}>
                <Text style={styles.headerStyle}>Monthly Summary</Text>
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
                <SectionList style={{paddingLeft: 20,
                    paddingRight: 20}}
                    sections={datasource}
                             keyExtractor={(item, index) => item.key ? `${item.key}-${index}` : `${index}`}


                             renderItem={renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionHeader}>{title}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.navigatorbarStyle}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Home', { datasource: datasource});
                    }}>
                        <Image source={require('./img/homepressed.png')} style={{ width: 50, height: 50 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true);
                    }}>
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

export default Home;
