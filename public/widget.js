/**
 * TradeSuite Booking Widget
 * 
 * Embed this widget on any website using:
 * <script src="https://tradesuite.app/widget.js" data-trade="electrician" data-company="abc-electric"></script>
 */

(function() {
  'use strict';

  // Configuration
  const WIDGET_VERSION = '1.0.0';
  const DEFAULT_POSITION = 'bottom-right';
  const DEFAULT_COLOR = '#2563eb'; // blue-600
  
  // Get script element to read data attributes
  const scriptElement = document.currentScript || document.querySelector('script[data-widget="tradesuite"]');
  
  if (!scriptElement) {
    console.error('TradeSuite Widget: Could not find script element');
    return;
  }

  // Read configuration from data attributes
  const config = {
    trade: scriptElement.dataset.trade || 'general',
    company: scriptElement.dataset.company || '',
    color: scriptElement.dataset.color || DEFAULT_COLOR,
    position: scriptElement.dataset.position || DEFAULT_POSITION,
    buttonText: scriptElement.dataset.buttonText || 'Book Now',
    buttonIcon: scriptElement.dataset.buttonIcon || 'calendar',
    height: scriptElement.dataset.height || '600px',
    width: scriptElement.dataset.width || '400px',
  };

  // Position styles based on config
  const positionStyles = {
    'bottom-right': 'bottom: 20px; right: 20px;',
    'bottom-left': 'bottom: 20px; left: 20px;',
    'top-right': 'top: 80px; right: 20px;',
    'top-left': 'top: 80px; left: 20px;',
  };

  // Create widget container
  const containerId = 'tradesuite-widget-container';
  
  // Create trigger button
  const buttonStyles = `
    position: fixed;
    ${positionStyles[config.position] || positionStyles['bottom-right']}
    z-index: 9999;
    background-color: ${config.color};
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  // Calendar icon SVG
  const calendarIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  `;

  // Close icon SVG
  const closeIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    #tradesuite-widget-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(0,0,0,0.35);
    }
    #tradesuite-widget-frame {
      transition: all 0.3s ease;
    }
    #tradesuite-widget-overlay {
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(styleSheet);

  // Track if widget is open
  let isOpen = false;

  // Create trigger button
  const triggerBtn = document.createElement('button');
  triggerBtn.id = 'tradesuite-widget-btn';
  triggerBtn.innerHTML = `${calendarIcon}<span>${config.buttonText}</span>`;
  triggerBtn.style.cssText = buttonStyles;
  document.body.appendChild(triggerBtn);

  // Create iframe overlay (hidden by default)
  const overlay = document.createElement('div');
  overlay.id = 'tradesuite-widget-overlay';
  overlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99998;
  `;
  document.body.appendChild(overlay);

  // Create iframe container
  const iframeContainer = document.createElement('div');
  iframeContainer.id = 'tradesuite-widget-frame';
  iframeContainer.style.cssText = `
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 50px rgba(0,0,0,0.25);
    overflow: hidden;
    animation: slideUp 0.3s ease;
  `;
  document.body.appendChild(iframeContainer);

  // Create iframe
  const iframe = document.createElement('iframe');
  const bookingUrl = new URL('https://tradesuite.app/book');
  if (config.trade) bookingUrl.searchParams.set('trade', config.trade);
  if (config.company) bookingUrl.searchParams.set('company', config.company);
  
  iframe.src = bookingUrl.toString();
  iframe.style.cssText = `
    width: ${config.width};
    height: ${config.height};
    border: none;
  `;
  iframe.allow = 'accelerometer; camera; geolocation';
  iframeContainer.appendChild(iframe);

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = closeIcon;
  closeBtn.style.cssText = `
    position: absolute;
    top: 12px;
    right: 12px;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 100000;
    color: #374151;
  `;
  iframeContainer.appendChild(closeBtn);

  // Open widget
  function openWidget() {
    isOpen = true;
    overlay.style.display = 'block';
    iframeContainer.style.display = 'block';
    triggerBtn.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }

  // Close widget
  function closeWidget() {
    isOpen = false;
    overlay.style.display = 'none';
    iframeContainer.style.display = 'none';
    triggerBtn.style.display = 'flex';
    document.body.style.overflow = '';
  }

  // Event listeners
  triggerBtn.addEventListener('click', openWidget);
  overlay.addEventListener('click', closeWidget);
  closeBtn.addEventListener('click', closeWidget);

  // Listen for escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeWidget();
    }
  });

  // Listen for messages from iframe (for booking completion)
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://tradesuite.app') return;
    
    if (event.data === 'tradesuite:booking-complete') {
      // Close widget and show success message
      closeWidget();
      
      // Optional: Show success toast
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 99999;
        animation: fadeIn 0.3s ease;
      `;
      toast.textContent = '✓ Booking Confirmed!';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  });

  // Expose API
  window.TradeSuiteWidget = {
    open: openWidget,
    close: closeWidget,
    version: WIDGET_VERSION,
  };

  console.log(`TradeSuite Widget v${WIDGET_VERSION} loaded`);
})();