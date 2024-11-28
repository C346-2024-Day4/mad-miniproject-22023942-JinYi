import React from 'react';
import { StatusBar, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { datasource } from "./Data";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerStyle: {
        marginTop: 20,
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#e0e0e0',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    itemContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    textStyle: {
        fontSize: 16,
        color: '#333',
    },
});

const Home = ({ navigation }) => {
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    // navigation.navigate('Edit', { index, type: section });
                }}
            >
                <View style={styles.itemContainer}>
                    <Text style={styles.textStyle}>{item.key || item.category}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text style={styles.headerStyle}>Expense & Income Manager</Text>
            <SectionList
                sections={datasource}
                keyExtractor={(item, index) => item + index}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default Home;
