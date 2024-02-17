import { useState, useEffect, memo } from 'react';
import { Select, Box, Text, Code } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const TransactionsPieChart = () => {
    const [selectedMonth, setSelectedMonth] = useState('03');
    const [pieData, setPieData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPieData = async () => {
        try {
            const response = await axios.get(`https://smoggy-fawn-swimsuit.cyclic.app/pie-chart?month=${selectedMonth}`);
            setPieData(Object.entries(response.data).map(([category, count]) => ({ name: category, value: count })));
            setLoading(false)
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
        }
    };

    useEffect(() => {
        if (selectedMonth) {
            fetchPieData();
        }
    }, [selectedMonth]);
    if (loading) {
        return <h3>Loading....</h3>
    }
    return (
        <Box display={{ base: 'flex', md: 'flex' }}
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
                <Code colorScheme='green' style={{ padding: "20px", textAlign: "center" }}>Transactions Pie Chart :{selectedMonth}</Code>
                <PieChart width={400} height={400}>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </Box>
        </Box>
    );
};

export default memo(TransactionsPieChart);
