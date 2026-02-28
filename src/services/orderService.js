import axiosInstance from './axiosInstance';

// ============================================================
// MOCK ORDERS DATA (Cash on Delivery orders)
// ============================================================
let mockOrders = [
    {
        id: 2001,
        userId: 2,
        customerName: 'John Doe',
        customerPhone: '9876543210',
        place: 'Tatipaka',
        address: 'Kirana Street, Tatipaka, Razole Mandalam',
        items: [
            { productId: 1, name: 'Basmati Rice (5kg)', price: 420, quantity: 2, total: 840 },
            { productId: 7, name: 'Full Cream Milk (1L)', price: 62, quantity: 3, total: 186 },
        ],
        grandTotal: 1026,
        paymentType: 'Cash on Delivery',
        paymentStatus: 'Pending Payment',
        status: 'Pending',
        date: '2026-02-27T11:00:00Z',
    },
    {
        id: 2002,
        userId: 2,
        customerName: 'John Doe',
        customerPhone: '9876543210',
        place: 'Tatipaka',
        address: 'Kirana Street, Tatipaka, Razole Mandalam',
        items: [
            { productId: 19, name: 'Turmeric Powder (200g)', price: 55, quantity: 2, total: 110 },
            { productId: 25, name: 'Sunflower Oil (1L)', price: 145, quantity: 1, total: 145 },
        ],
        grandTotal: 255,
        paymentType: 'Cash on Delivery',
        paymentStatus: 'Paid',
        status: 'Verified',
        date: '2026-02-26T09:30:00Z',
    },
];

let orderNextId = 2003;

// ============================================================
// Order Service
// ============================================================
const orderService = {
    // Customer: place a new COD order
    placeOrder: async (orderData) => {
        try {
            const response = await axiosInstance.post('/orders', orderData);
            return response.data;
        } catch {
            const newOrder = {
                id: orderNextId++,
                userId: orderData.userId,
                customerName: orderData.customerName,
                customerPhone: orderData.customerPhone,
                place: orderData.place || '',
                address: orderData.address || '',
                items: orderData.items,
                grandTotal: orderData.grandTotal,
                paymentType: 'Cash on Delivery',
                paymentStatus: 'Pending Payment',
                status: 'Pending',
                date: new Date().toISOString(),
            };
            mockOrders.push(newOrder);
            return newOrder;
        }
    },

    // Admin: get all COD orders
    getAllOrders: async () => {
        try {
            const response = await axiosInstance.get('/orders');
            return response.data;
        } catch {
            return [...mockOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    },

    // Customer: get orders for a specific user
    getUserOrders: async (userId) => {
        try {
            const response = await axiosInstance.get('/orders/user/' + userId);
            return response.data;
        } catch {
            return mockOrders
                .filter((o) => o.userId === userId)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    },

    // Admin: get single order details
    getOrderById: async (orderId) => {
        try {
            const response = await axiosInstance.get('/orders/' + orderId);
            return response.data;
        } catch {
            const order = mockOrders.find((o) => o.id === parseInt(orderId));
            if (!order) throw new Error('Order not found');
            return order;
        }
    },

    // Admin: mark order as Verified
    verifyOrder: async (orderId) => {
        try {
            const response = await axiosInstance.put('/orders/' + orderId + '/verify');
            return response.data;
        } catch {
            const order = mockOrders.find((o) => o.id === parseInt(orderId));
            if (order) order.status = 'Verified';
            return order;
        }
    },

    // Admin: approve payment (paymentStatus → Paid)
    approvePayment: async (orderId) => {
        try {
            const response = await axiosInstance.put('/orders/' + orderId + '/approve-payment');
            return response.data;
        } catch {
            const order = mockOrders.find((o) => o.id === parseInt(orderId));
            if (order) order.paymentStatus = 'Paid';
            return order;
        }
    },

    // Admin: mark order as Delivered (requires paymentStatus === 'Paid')
    deliverOrder: async (orderId) => {
        try {
            const response = await axiosInstance.put('/orders/' + orderId + '/deliver');
            return response.data;
        } catch {
            const order = mockOrders.find((o) => o.id === parseInt(orderId));
            if (order) order.status = 'Delivered';
            return order;
        }
    },

    // Admin: update order items (edited quantities)
    updateOrderItems: async (orderId, items, grandTotal) => {
        try {
            const response = await axiosInstance.put('/orders/' + orderId + '/items', { items, grandTotal });
            return response.data;
        } catch {
            const order = mockOrders.find((o) => o.id === parseInt(orderId));
            if (order) {
                order.items = items;
                order.grandTotal = grandTotal;
            }
            return order;
        }
    },
};

export default orderService;
