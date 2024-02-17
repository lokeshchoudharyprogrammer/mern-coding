
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors")
const moment = require('moment');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config()
// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(bodyParser.json());
app.use(cors())


app.get('/initialize-database', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;
        await Transaction.insertMany(transactions);
        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'An error occurred while initializing the database' });
    }
});
app.get('/transactions', async (req, res) => {
    try {
        let { search, page, perPage, month } = req.query;

        page = parseInt(page) || 1;
        perPage = parseInt(perPage) || 10;


        let searchQuery = {};

        if (search) {
            const price = parseFloat(search);
            if (!isNaN(price)) {
                searchQuery = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { price: price }
                    ]
                };
            } else {
                searchQuery = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                };
            }
        }
        if (month) {
            const selectedMonth = parseInt(month);
            if (!isNaN(selectedMonth) && selectedMonth >= 1 && selectedMonth <= 12) {
                searchQuery = {
                    ...searchQuery,
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, selectedMonth]
                    }
                };
            }
        }
        const totalCount = await Transaction.countDocuments(searchQuery);
        const paginatedTransactions = await Transaction.find(searchQuery)
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.json({
            total: totalCount,
            page,
            perPage,
            transactions: paginatedTransactions
        });
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/statistics', async (req, res) => {
    try {
        const { month } = req.query;


        const selectedMonth = parseInt(month);
        const dataForSelectedMonth = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, selectedMonth]
            }
        });
        const totalSaleAmount = dataForSelectedMonth.reduce((acc, curr) => acc + curr.price, 0);
        const totalSoldItems = dataForSelectedMonth.filter(item => item.sold).length;
        const totalUnsoldItems = dataForSelectedMonth.length - totalSoldItems;

        const statistics = {
            totalSaleAmount,
            totalSoldItems,
            totalUnsoldItems
        };

        res.json(statistics);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/bar-chart', async (req, res) => {
    try {
        const { month } = req.query;

        // Convert the month parameter to an integer
        const selectedMonth = parseInt(month);

        // Fetch data for the selected month across all years
        const dataForSelectedMonth = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, selectedMonth]
            }
        });

        // Calculate price ranges and count of items falling within each range
        const barChartData = {
            "0 - 100": 0,
            "101 - 200": 0,
            "201 - 300": 0,
            "301 - 400": 0,
            "401 - 500": 0,
            "501 - 600": 0,
            "601 - 700": 0,
            "701 - 800": 0,
            "801 - 900": 0,
            "901-above": 0
        };

        dataForSelectedMonth.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) barChartData["0 - 100"]++;
            else if (price <= 200) barChartData["101 - 200"]++;
            else if (price <= 300) barChartData["201 - 300"]++;
            else if (price <= 400) barChartData["301 - 400"]++;
            else if (price <= 500) barChartData["401 - 500"]++;
            else if (price <= 600) barChartData["501 - 600"]++;
            else if (price <= 700) barChartData["601 - 700"]++;
            else if (price <= 800) barChartData["701 - 800"]++;
            else if (price <= 900) barChartData["801 - 900"]++;
            else barChartData["901-above"]++;
        });

        res.json(barChartData);
    } catch (err) {
        console.error('Error occurred while fetching bar chart data', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/pie-chart', async (req, res) => {
    try {
        const { month } = req.query;

        // Convert the month parameter to an integer
        const selectedMonth = parseInt(month);

        // Fetch data for the selected month across all years
        const dataForSelectedMonth = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, selectedMonth]
            }
        });

        // Calculate count of items for each category
        const categoryCounts = {};
        dataForSelectedMonth.forEach(transaction => {
            const category = transaction.category;
            if (!categoryCounts[category]) {
                categoryCounts[category] = 1;
            } else {
                categoryCounts[category]++;
            }
        });

        res.json(categoryCounts);
    } catch (err) {
        console.error('Error occurred while fetching pie chart data', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


db.once('open', () => {
    console.log('Connected to database');

});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
