import '@testing-library/jest-dom';

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

if (!global.ResizeObserver) {
	(global as any).ResizeObserver = ResizeObserver;
}
