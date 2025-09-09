import { RollingDotHeadline } from '@/components/RollingDotHeadline';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeSync } from '@/components/ThemeSync';
import { Box, VStack, Text, Container } from '@chakra-ui/react';

export default function HeadlineTestPage() {
  return (
    <>
      <ThemeSync />
      <Header />
      <Container py={16}>
        <VStack gap={16} align="start">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="text" mb={4}>
              RollingDotHeadline Component Test
            </Text>
            <Text fontSize="lg" color="muted" mb={8}>
              Scroll down to see the animation replay when elements come back into view.
              The rolling dot travels under the text while each character hops as it passes.
              When the dot reaches the end, it becomes the final period and remains there.
              On mobile, text wraps naturally and the dot follows a staircase-like path.
            </Text>
          </Box>

          {/* Test 1: Default settings */}
          <Box>
            <Text fontSize="lg" fontWeight="medium" color="text" mb={4}>
              Default Settings (no period):
            </Text>
            <RollingDotHeadline 
              text="Welcome to Rent1T"
              className="text-4xl font-bold"
            />
          </Box>

          {/* Test 2: Custom colors and timing with period */}
          <Box>
            <Text fontSize="lg" fontWeight="medium" color="text" mb={4}>
              Custom Colors & Timing (with period):
            </Text>
            <RollingDotHeadline 
              text="Rent anything, anywhere."
              dotColor="var(--brand)"
              jumpHeight={15}
              stagger={0.1}
              className="text-5xl font-extrabold"
            />
          </Box>

          {/* Test 3: Long text with period that wraps on mobile */}
          <Box>
            <Text fontSize="lg" fontWeight="medium" color="text" mb={4}>
              Long Text with Period (wraps on mobile):
            </Text>
            <RollingDotHeadline 
              text="This is a very long headline that will wrap to multiple lines on mobile devices and the dot should follow a staircase path."
              dotColor="#ff6a00"
              jumpHeight={8}
              stagger={0.03}
              className="text-2xl md:text-3xl font-semibold"
            />
          </Box>

          {/* Test 4: Different dot colors with periods */}
          <Box>
            <Text fontSize="lg" fontWeight="medium" color="text" mb={4}>
              Different Dot Colors (with periods):
            </Text>
            <VStack gap={4} align="start">
              <RollingDotHeadline 
                text="Green Dot."
                dotColor="#16A34A"
                className="text-2xl font-bold"
              />
              <RollingDotHeadline 
                text="Red Dot."
                dotColor="#EF4444"
                className="text-2xl font-bold"
              />
              <RollingDotHeadline 
                text="Blue Dot."
                dotColor="#3B82F6"
                className="text-2xl font-bold"
              />
            </VStack>
          </Box>

          {/* Test 5: Disabled replay on view */}
          <Box>
            <Text fontSize="lg" fontWeight="medium" color="text" mb={4}>
              No Replay on View (plays once):
            </Text>
            <RollingDotHeadline 
              text="One Time Only."
              dotColor="var(--brand)"
              replayOnView={false}
              className="text-3xl font-bold"
            />
          </Box>

          {/* Spacer to test scroll behavior */}
          <Box h="200vh" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="lg" color="muted">
              Scroll back up to see animations replay
            </Text>
          </Box>

          {/* Test 6: Mobile-specific wrapping test */}
          <Box>
            <Text fontSize="lg" fontWeight="medium" color="text" mb={4}>
              Mobile Wrapping Test (resize window to see effect):
            </Text>
            <RollingDotHeadline 
              text="This headline will definitely wrap on small screens and the dot should follow the text flow like a staircase."
              dotColor="var(--amber-600)"
              jumpHeight={10}
              stagger={0.06}
              className="text-xl sm:text-2xl md:text-3xl font-bold"
            />
          </Box>

          {/* Test 7: Final test at bottom */}
          <Box>
            <Text fontSize="lg" fontWeight="medium" color="text" mb={4}>
              Final Test (should animate when scrolled into view):
            </Text>
            <RollingDotHeadline 
              text="Scroll Triggered Animation."
              dotColor="var(--amber-600)"
              jumpHeight={10}
              stagger={0.06}
              className="text-4xl font-bold"
            />
          </Box>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
