import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./Home.js";
import Charts from "./Charts.js";
import Expense from "./Expense.js";
import AddExpense from "./AddExpense.js";
import AddIncome from "./AddIncome.js";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Charts" component={Charts} />
                <Stack.Screen name="Expense" component={Expense} />
                <Stack.Screen name="AddExpense" component={AddExpense} />
                <Stack.Screen name="AddIncome" component={AddIncome} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;


