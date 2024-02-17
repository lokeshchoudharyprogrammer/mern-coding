import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionDashboard from './TransactionDashboard';
import TransactionsStatistics from './TransactionsStatistics';
import TransactionsPieChart from './TransactionsPieChart';
import TransactionsBarChart from './TransactionsBarChart';

const Routers = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<TransactionDashboard />} />
                <Route path="/Statistics" element={<TransactionsStatistics />} />
                <Route path="/Pie-Chart" element={<TransactionsPieChart />} />
                <Route path="/Bar-Chart" element={<TransactionsBarChart />} />
            </Routes>

        </>
    )
}

export default Routers