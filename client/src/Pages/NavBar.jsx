import { useState } from 'react';
import { Box, Flex, Link, Text, IconButton, useDisclosure, Collapse } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useState(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="teal.500"
      color="white"
    >
      <Flex align="center">
        <NavLink to="/">
          <Link>
            <Text fontSize="xl" fontWeight="bold">MERN Stack Coding Challenge</Text>
          </Link>
        </NavLink>
      </Flex>

      <Box display={{ base: 'block', md: 'none' }}>
        <IconButton
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          aria-label="Toggle navigation"
        />
      </Box>

      <Collapse in={isOpen || !isMobile} animateOpacity>
        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
        >
          <NavLink to="/Pie-Chart">
            <Link mr={4}>Pie-Chart</Link>
          </NavLink>
          <NavLink to="/Bar-Chart">
            <Link mr={4}>Bar-Chart</Link>
          </NavLink>
          <NavLink to="/Statistics">
            <Link mr={4}>Statistics</Link>
          </NavLink>

        </Box>
      </Collapse>
    </Flex>
  );
};

export default Navbar;
