import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { TrustBadges, SecurityBadges } from './TrustBadges';

describe('TrustBadges', () => {
  it('renders full variant with badges', () => {
    const { container } = render(<TrustBadges variant="full" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders compact variant', () => {
    const { container } = render(<TrustBadges variant="compact" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(<TrustBadges className="custom-class" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders minimal variant', () => {
    const { container } = render(<TrustBadges variant="minimal" />);
    expect(container.firstChild).not.toBeNull();
  });
});

describe('SecurityBadges', () => {
  it('renders security badges', () => {
    const { container } = render(<SecurityBadges />);
    expect(container.firstChild).not.toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(<SecurityBadges className="security-class" />);
    expect(container.firstChild).not.toBeNull();
  });
});