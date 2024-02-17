

/* 


This is the DBS of the application and I haven't created any complex data that I don't want
I am using this simple file to create for server.

*/


const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors")
const moment = require('moment');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config()

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


app.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        await Transaction.insertMany(data);
        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ error: 'while initializing the database' });
    }
});

app.get('/transactions', async (req, res) => {
    try {
        let { search, page, perPage, month } = req.query;

        page = +page || 1;
        perPage = +perPage || 10;


        let UserQuery = {};

        if (search) {
            const price = parseFloat(search);
            if (!isNaN(price)) {
                UserQuery = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { price: price }
                    ]
                };
            } else {
                UserQuery = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                };
            }
        }
        if (month) {
            const currentMonth = +month;
            if (!isNaN(currentMonth) && currentMonth >= 1 && currentMonth <= 12) {
                UserQuery = {
                    ...UserQuery,
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, currentMonth]
                    }
                };
            }
        }
        const totalTransaction = await Transaction.countDocuments(UserQuery);
        const pagination = await Transaction.find(UserQuery)
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.json({
            total: totalTransaction,
            page,
            perPage,
            transactions: pagination
        });
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/statistics', async (req, res) => {
    try {
        const { month } = req.query;
        const currentMonth = +month;
        const data = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, currentMonth]
            }
        });
        const SaleAmount = data.reduce((acc, curr) => acc + curr.price, 0);
        const SoldItems = data.filter(item => item.sold).length;
        const UnsoldItems = data.length - SoldItems;

        const statistics = {
            SaleAmount,
            SoldItems,
            UnsoldItems
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
        const currentMonth = +month;
        const data = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, currentMonth]
            }
        });
        const barData = {
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
        data.forEach(elements => {
            const price = elements.price;
            if (price <= 100) barData["0 - 100"]++;
            else if (price <= 200) barData["101 - 200"]++;
            else if (price <= 300) barData["201 - 300"]++;
            else if (price <= 400) barData["301 - 400"]++;
            else if (price <= 500) barData["401 - 500"]++;
            else if (price <= 600) barData["501 - 600"]++;
            else if (price <= 700) barData["601 - 700"]++;
            else if (price <= 800) barData["701 - 800"]++;
            else if (price <= 900) barData["801 - 900"]++;
            else barData["901-above"]++;
        });
        res.json(barData);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/pie-chart', async (req, res) => {
    try {
        const { month } = req.query;
        const currentMonth = +month;
        const data = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, currentMonth]
            }
        });
        const category = {};
        data.forEach(element => {
            const category = element.category;
            if (!category[category]) {
                category[category] = 1;
            } else {
                category[category]++;
            }
        });

        res.json(category);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


db.once('open', () => {
    console.log('Connected to database');

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
