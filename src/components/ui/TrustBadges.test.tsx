import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { TrustBadges, SecurityBadges } from './TrustBadges';

describe('TrustBadges', () => {
  it('renders full variant with badges', () => {
    const { container } = render(<TrustBadges variant="full" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    const { container } = render(<TrustBadges variant="compact" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<TrustBadges className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders inline variant', () => {
    const { container } = render(<TrustBadges variant="inline" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('SecurityBadges', () => {
  it('renders security badges', () => {
    const { container } = render(<SecurityBadges />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SecurityBadges className="security-class" />);
    expect(container.firstChild).toHaveClass('security-class');
  });
});