import { Button, Group } from '@mantine/core';

export function ColorSchemeToggle() {
  return (
    <Group justify="center" mt="xl">
      <Button
        style={{
          background: 'linear-gradient(45deg, #f06595, #fff0f6)', // Pink gradient theme
          color: '#ffffff', // White text for contrast
          border: 'none',
        }}
      >
        Gradient Theme
      </Button>
    </Group>
  );
}
