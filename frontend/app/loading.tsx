import Loader from '@/components/ui/loader';

export default function Loading() {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFFFFF',
            }}
        >
            <Loader />
        </div>
    );
}