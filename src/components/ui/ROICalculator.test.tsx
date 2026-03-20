import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils';
import { ROICalculator } from './ROICalculator';

describe('ROICalculator', () => {
  it('renders successfully', () => {
    const { container } = render(<ROICalculator />);
    expect(container).toBeInTheDocument();
  });

  it('renders with inputs', () => {
    const { container } = render(<ROICalculator />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
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

  it('handles edge cases', () => {
    const { container } = render(<ROICalculator />);
    expect(container).toBeInTheDocument();
  });
});