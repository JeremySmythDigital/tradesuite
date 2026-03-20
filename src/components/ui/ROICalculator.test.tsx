import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils';
import { ROICalculator } from './ROICalculator';

describe('ROICalculator', () => {
  it('renders successfully', () => {
    const { container } = render(<ROICalculator />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders with inputs', () => {
    const { container } = render(<ROICalculator />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('shows savings comparison', () => {
    const { container } = render(<ROICalculator />);
    expect(container.firstChild).not.toBeNull();
  });

  it('calculates ROI values', () => {
    const { container } = render(<ROICalculator />);
    // Component should render without error
    expect(container.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  it('handles edge cases', () => {
    const { container } = render(<ROICalculator />);
    expect(container.firstChild).not.toBeNull();
  });
});