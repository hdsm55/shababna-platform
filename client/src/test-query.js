// اختبار React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchEvents } from './services/eventsApi';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            staleTime: 0,
        },
    },
});

async function testQuery() {
    try {
        console.log('🔍 اختبار React Query...');

        const result = await queryClient.fetchQuery({
            queryKey: ['events', {}],
            queryFn: () => fetchEvents({}),
        });

        console.log('📊 نتيجة React Query:', result);
        console.log('📋 عدد الفعاليات:', result.data?.events?.length || 0);

    } catch (error) {
        console.error('❌ خطأ في React Query:', error);
    }
}

testQuery();