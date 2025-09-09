import React from 'react';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';
import { Button } from './ui/Button';

export function ButtonTest() {
  return (
    <Box p={8} bg="bg" minH="100vh">
      <VStack gap={8} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="text">
          Warm Orange/Amber Button Test
        </Text>
        
        <VStack gap={4} align="start">
          <Text fontSize="lg" color="text">Button Sizes:</Text>
          <HStack gap={4}>
            <Button size="sm">Small Button</Button>
            <Button size="md">Medium Button</Button>
            <Button size="lg">Large Button</Button>
          </HStack>
        </VStack>

        <VStack gap={4} align="start">
          <Text fontSize="lg" color="text">Button States:</Text>
          <HStack gap={4}>
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <button className="button">HTML Button</button>
            <button data-ambient="amber">Data Attribute</button>
          </HStack>
        </VStack>

        <VStack gap={4} align="start">
          <Text fontSize="lg" color="text">Interactive Test:</Text>
          <Text fontSize="sm" color="muted">
            All buttons now have warm orange/amber gradient backgrounds by default.
            Hover over buttons to see intensified orange glow effect. 
            Focus with Tab to see enhanced focus styles. 
            The glow should spin continuously and pulse on idle.
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
