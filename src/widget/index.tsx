
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Widget } from './Widget';
import styles from '@/app/globals.css?inline';

(function () {
    console.log('Guidemark Widget Loading...');
    const script = document.currentScript || document.querySelector('script[data-project-id]');
    const projectId = script?.getAttribute('data-project-id');
    const autoStart = script?.getAttribute('data-auto-start') !== 'false'; // defaults to true
    const showAdminPanel = script?.getAttribute('data-admin-panel') !== 'false'; // defaults to true

    if (!projectId) {
        console.error('Guidemark: No project ID found');
        return;
    }

    const hostId = 'producttour-host';
    if (document.getElementById(hostId)) return;

    const host = document.createElement('div');
    host.id = hostId;
    host.style.position = 'fixed';
    host.style.inset = '0';
    host.style.zIndex = '2147483647';
    host.style.pointerEvents = 'none'; // Content has pointer-events: auto
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    // Inject Styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    shadow.appendChild(styleEl);

    // Mount Point
    const container = document.createElement('div');
    container.id = 'producttour-root';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    shadow.appendChild(container);

    const root = createRoot(container);
    root.render(<Widget projectId={projectId} autoStart={autoStart} showAdminPanel={showAdminPanel} />);
})();
