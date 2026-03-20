/// <reference types="vitest" />
import { vi } from 'vitest';
import React from 'react';

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    React.createElement('a', { href }, children),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height }: { src: string; alt: string; width?: number; height?: number }) => 
    React.createElement('img', { src, alt, width, height }),
}));

vi.mock('next/font/google', () => ({
  Plus_Jakarta_Sans: () => ({ variable: '--font-plus-jakarta' }),
  Space_Grotesk: () => ({ variable: '--font-space-grotesk' }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    section: ({ children, ...props }: any) => React.createElement('section', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    p: ({ children, ...props }: any) => React.createElement('p', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
  useInView: vi.fn(() => [React.createRef(), true]),
  useAnimation: vi.fn(() => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() })),
  useScroll: vi.fn(() => ({ scrollY: { get: vi.fn() } })),
  useTransform: vi.fn(() => 0),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));