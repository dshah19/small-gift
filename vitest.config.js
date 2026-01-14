import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.test.js',
                '**/*.spec.js'
            ]
        },
        include: ['**/*.test.js', '**/*.spec.js'],
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache']
    }
});
