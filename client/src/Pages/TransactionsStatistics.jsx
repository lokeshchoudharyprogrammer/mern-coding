import { useState, useEffect, memo } from 'react';
import { Select, Box, Code } from '@chakra-ui/react';
import axios from 'axios';

const TransactionsStatistics = () => {
    const [selectedMonth, setSelectedMonth] = useState('03');
    const [statistics, setStatistics] = useState(null);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/statistics?month=${selectedMonth}`);
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        if (selectedMonth) {
            fetchStatistics();
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
            gap="124px"
        >
            <Select
                width={"245px"}
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

            {statistics && (
                <Box mt={4} p={4} borderWidth="1px" borderRadius="md">

                    <Code colorScheme='green'>Total sale items: {statistics.totalSaleAmount}</Code>
                    <br />
                    <br />
                    <Code colorScheme='green'>Total sold items: {statistics.totalSoldItems}</Code>
                    <br />
                    <br />
                    <Code colorScheme='yellow'>Total unsold items: {statistics.totalUnsoldItems}</Code>

                </Box>
            )}
        </Box>
    );
};

export default memo(TransactionsStatistics);
