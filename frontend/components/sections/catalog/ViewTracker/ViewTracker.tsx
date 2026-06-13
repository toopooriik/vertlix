'use client';

import { useEffect } from 'react';

import { trackCategoryView, trackProductView } from '@/src/shared/api/catalog';

type ViewTrackerProps = {
    id: number;
    type: 'category' | 'product';
    delayMs?: number;
};

export default function ViewTracker({
    id,
    type,
    delayMs = 5000,
}: ViewTrackerProps) {
    useEffect(() => {
        if (!id) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            const request = type === 'category' ? trackCategoryView : trackProductView;

            request(id).catch(() => undefined);
        }, delayMs);

        return () => window.clearTimeout(timeoutId);
    }, [delayMs, id, type]);

    return null;
}
