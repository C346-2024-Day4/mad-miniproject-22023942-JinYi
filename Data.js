const datasource = [
    {
        data: [
            {
                items: [
                    { key: "Pizza", amount: 13.20 },
                    { key: "Beef Noodle Soup", amount: 15.10 }
                ],
                category: "Food",  budget: 300, image: require("./img/food.png"), color: '#89A8B2'
            },
            {
                items: [
                    { key: "Stuff Toy", amount: 20.15 }
                ],
                category: "Entertainment",  budget: 150, image: require("./img/entertainment.png"), color: '#B3C8CF'
            },
            {
                items: [
                ],
                category: "Utilities",  budget: 0, image: require("./img/utilities.png"), color: '#E5E1DA'
            },
            {
                items: [
                ],
                category: "Transportation",  budget: 0, image: require("./img/transportation.png"), color: '#E5E1DA'
            },
            {
                items: [
                ],
                category: "Groceries",  budget: 0, image: require("./img/groceries.png"), color: '#4A628A'
            },
            {
                items: [
                ],
                category: "Others",  budget: 0, image: require("./img/others.png"), color: '#B9E5E8'
            }
        ],
        title: "Expense"
    },
    {
        data: [
            {key: "Allowance", amount: 80.00, image: require("./img/cash.png")},
            {key: "Part Time Job", amount: 400.00, image: require("./img/cash.png")}
        ], title: "Income"
    }
];


export {datasource};
