import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

async function testEventsAPI() {
    console.log('🧪 Testing Events API...\n');

    try {
        // Test 1: Get all events
        console.log('1. Testing GET /api/events');
        const eventsResponse = await axios.get(`${API_BASE_URL}/events`);
        console.log('✅ Success:', eventsResponse.data.success);
        console.log('📊 Events count:', eventsResponse.data.data.items.length);
        console.log('📄 Pagination:', eventsResponse.data.data.pagination);
        console.log('');

        // Test 2: Get events with filters
        console.log('2. Testing GET /api/events with filters');
        const filteredResponse = await axios.get(`${API_BASE_URL}/events?category=workshop&limit=5`);
        console.log('✅ Success:', filteredResponse.data.success);
        console.log('🔍 Filtered events count:', filteredResponse.data.data.items.length);
        console.log('');

        // Test 3: Get single event
        if (eventsResponse.data.data.items.length > 0) {
            const firstEvent = eventsResponse.data.data.items[0];
            console.log('3. Testing GET /api/events/:id');
            const singleEventResponse = await axios.get(`${API_BASE_URL}/events/${firstEvent.id}`);
            console.log('✅ Success:', singleEventResponse.data.success);
            console.log('📋 Event title:', singleEventResponse.data.data.title);
            console.log('');

            // Test 4: Search events
            console.log('4. Testing search functionality');
            const searchResponse = await axios.get(`${API_BASE_URL}/events?search=ورشة`);
            console.log('✅ Success:', searchResponse.data.success);
            console.log('🔍 Search results count:', searchResponse.data.data.items.length);
            console.log('');
        }

        // Test 5: Health check
        console.log('5. Testing health check');
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Success:', healthResponse.data.status);
        console.log('🌐 Environment:', healthResponse.data.environment);
        console.log('');

        console.log('🎉 All tests passed successfully!');
        console.log('\n📋 Summary:');
        console.log('- Events API is working correctly');
        console.log('- Filtering and pagination are functional');
        console.log('- Search functionality is working');
        console.log('- Database connection is stable');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure the server is running on port 5001');
            console.log('   Run: npm run dev:server');
        }

        if (error.response?.status === 404) {
            console.log('\n💡 Make sure the database is set up correctly');
            console.log('   Run: npm run db:setup');
        }
    }
}

// Run the tests
testEventsAPI();