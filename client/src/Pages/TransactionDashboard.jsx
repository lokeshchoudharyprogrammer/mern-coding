import React, { useState, useEffect, memo } from "react";
import {
    Box,
    Button,
    Code,
    Input,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import axios from 'axios';

const TransactionDashboard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [transactions, setTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchTransactions();
    }, [selectedMonth, searchTerm, currentPage]);

    const fetchTransactions = async () => {

        try {
            const response = await axios.get(`https://smoggy-fawn-swimsuit.cyclic.app/transactions?search=${searchTerm ? searchTerm : ""}&page=${currentPage}&perPage=${ITEMS_PER_PAGE}${selectedMonth ? `&month=${selectedMonth}` : ""}`);

            setTransactions(response.data.transactions);
            setTotalTransactions(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleNextPage = () => {
        if (totalTransactions / ITEMS_PER_PAGE === currentPage) return
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleSearch = () => {
        fetchTransactions();
    };

    let btnDisable = currentPage === totalTransactions / ITEMS_PER_PAGE

    if(loading){
        return <h3>loading....</h3>
    }
    return (
        <Box p={4}>
            <Box mb={4} display="flex" justifyContent="space-between">
                <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                    ml={4}
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
                <Button ml={4} colorScheme="blue" width="120px" onClick={handleSearch}>
                    Search
                </Button>
            </Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Title</Th>
                        <Th>Description</Th>
                        <Th>Price</Th>
                        <Th>Category</Th>
                        <Th>Sold</Th>
                        <Th>Image</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {transactions.map((transaction) => (
                        <Tr key={transaction.id}>
                            <Td>{transaction.id}</Td>
                            <Td>{transaction.title}</Td>
                            <Td>{transaction.description}</Td>
                            <Td>${transaction.price}</Td>
                            <Td>{transaction.category}</Td>
                            <Td>{transaction.sold == true ? "Sold" : "Not Sold"}</Td>
                            <Td><img src={transaction.image} width="120px" alt={transaction.title} /></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <Box mt={4} textAlign="center" display={"flex"} justifyContent={"space-between"}>

                <Code colorScheme='green' style={{ padding: "20px", textAlign: "center" }}>Page Number : {currentPage}</Code>
                <Button
                    mr={2}
                    colorScheme="blue"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    ml={2}
                    colorScheme="blue"
                    onClick={handleNextPage}
                    disabled={currentPage === btnDisable}
                >
                    Next
                </Button>
                <Code colorScheme='green' style={{ padding: "20px", textAlign: "center" }}>Par Page 10</Code>


            </Box>
        </Box>
    );
};

export default memo(TransactionDashboard);
