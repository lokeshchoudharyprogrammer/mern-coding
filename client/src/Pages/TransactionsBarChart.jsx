import { useState, useEffect, memo } from 'react';
import { Select, Box, Text ,Code} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const TransactionsBarChart = () => {
    const [selectedMonth, setSelectedMonth] = useState('03');
    const [chartData, setChartData] = useState([]);

    const fetchChartData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/bar-chart?month=${selectedMonth}`);
            setChartData(Object.entries(response.data).map(([range, count]) => ({ range, count })));
        } catch (error) {
            console.error('Error', error);
        }
    };

    useEffect(() => {
        if (selectedMonth) {
            fetchChartData();
        }
    }, [selectedMonth]);

    return (
        <Box
            display={{ base: 'flex', md: 'flex' }}
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems={'center'}
            width={"80%"}
            justifyContent={"center"}
            margin={"auto"}
            mt="12"
        >
           
            <Select
                placeholder="Select month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </Select>
            <Box mt={4}>
            <Code colorScheme='green' style={{ padding: "20px", textAlign: "center" }}>Transactions Bar Char :{selectedMonth}</Code>
                <BarChart width={800} height={400} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </Box>
        </Box>
    );
};

export default memo(TransactionsBarChart);
