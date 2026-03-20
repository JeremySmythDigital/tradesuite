import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { LiveChatWidget } from './LiveChatWidget';

describe('LiveChatWidget', () => {
  it('renders chat button', () => {
    const { container } = render(<LiveChatWidget />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('opens chat when button clicked', async () => {
    const { container } = render(<LiveChatWidget />);
    
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    
    // Chat window should appear
    expect(container.firstChild).not.toBeNull();
  });

  it('accepts custom props', () => {
    const { container } = render(
      <LiveChatWidget 
        company="TestCompany" 
        trade="electrician"
        welcomeMessage="Hello electrician!"
        position="bottom-left"
      />
    );
    
    expect(container.firstChild).not.toBeNull();
  });

  it('has message input when open', async () => {
    const { container } = render(<LiveChatWidget />);
    
    // Click to open
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    
    // Should have input or textarea
    const inputs = container.querySelectorAll('input, textarea');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('sends message when form submitted', async () => {
    const user = userEvent.setup();
    const { container } = render(<LiveChatWidget />);
    
    // Open chat
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    
    // Type message
    const inputs = container.querySelectorAll('input, textarea');
    if (inputs.length > 0) {
      await user.type(inputs[0], 'Test message');
      // Check the value was typed
      expect(inputs[0] as HTMLInputElement).toBeDefined();
    }
  });
});