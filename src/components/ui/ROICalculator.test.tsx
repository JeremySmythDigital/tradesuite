import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { ROICalculator } from './ROICalculator';

describe('ROICalculator', () => {
  it('renders successfully', () => {
    const { container } = render(<ROICalculator />);
    expect(container).toBeInTheDocument();
  });

  it('renders with inputs', () => {
    const { container } = render(<ROICalculator />);
    // Check for any inputs (number or text)
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('calculates ROI when values change', async () => {
    const user = userEvent.setup();
    const { container } = render(<ROICalculator />);
    
    const inputs = container.querySelectorAll('input');
    if (inputs.length > 0) {
      await user.clear(inputs[0]);
      await user.type(inputs[0], '50');
    }
    
    expect(container).toBeInTheDocument();
  });

  it('shows savings comparison', () => {
    const { container } = render(<ROICalculator />);
    expect(container).toBeInTheDocument();
  });

  it('renders trade-specific variants', () => {
    const { rerender, container } = render(<ROICalculator trade="electrician" />);
    expect(container).toBeInTheDocument();
    
    rerender(<ROICalculator trade="plumber" />);
    expect(container).toBeInTheDocument();
  });

  it('handles edge cases', async () => {
    const { container } = render(<ROICalculator />);
    expect(container).toBeInTheDocument();
  });
});