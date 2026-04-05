const https = require('https');
const crypto = require('crypto');

const Payment = require('./payment.model');
const Order = require('../order/order.model');

const postJson = (url, payload) => new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            try {
                const parsed = JSON.parse(data || '{}');
                resolve(parsed);
            } catch (error) {
                reject(new Error('Invalid JSON response from MoMo'));
            }
        });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
});

const signSha256 = (raw, secretKey) => {
    return crypto
        .createHmac('sha256', secretKey)
        .update(raw)
        .digest('hex');
};

const buildMomoCreateSignature = ({
    accessKey,
    amount,
    extraData,
    ipnUrl,
    orderId,
    orderInfo,
    partnerCode,
    redirectUrl,
    requestId,
    requestType,
}) => {
    const rawSignature = [
        `accessKey=${accessKey}`,
        `amount=${amount}`,
        `extraData=${extraData}`,
        `ipnUrl=${ipnUrl}`,
        `orderId=${orderId}`,
        `orderInfo=${orderInfo}`,
        `partnerCode=${partnerCode}`,
        `redirectUrl=${redirectUrl}`,
        `requestId=${requestId}`,
        `requestType=${requestType}`,
    ].join('&');

    return rawSignature;
};

const buildMomoIpnSignature = (payload) => {
    return [
        `accessKey=${payload.accessKey || ''}`,
        `amount=${payload.amount || ''}`,
        `extraData=${payload.extraData || ''}`,
        `message=${payload.message || ''}`,
        `orderId=${payload.orderId || ''}`,
        `orderInfo=${payload.orderInfo || ''}`,
        `orderType=${payload.orderType || ''}`,
        `partnerCode=${payload.partnerCode || ''}`,
        `payType=${payload.payType || ''}`,
        `requestId=${payload.requestId || ''}`,
        `responseTime=${payload.responseTime || ''}`,
        `resultCode=${payload.resultCode || ''}`,
        `transId=${payload.transId || ''}`,
    ].join('&');
};

module.exports = {
    CreatePayment: async function (orderId, method, actor) {
        const order = await Order.findById(orderId);
        if (!order) {
            const err = new Error('Order not found');
            err.statusCode = 404;
            throw err;
        }

        if (actor && actor.role !== 'admin' && String(order.user) !== String(actor.id)) {
            const err = new Error('You are not allowed to create payment for this order');
            err.statusCode = 403;
            throw err;
        }

        let newPayment = new Payment({ order: orderId, method });
        return await newPayment.save();
    },

    CreateMomoPayment: async function (orderId, actor) {
        const order = await Order.findById(orderId);
        if (!order) {
            const err = new Error('Order not found');
            err.statusCode = 404;
            throw err;
        }

        if (actor && actor.role !== 'admin') {
            if (!order.user || String(order.user) !== String(actor.id)) {
                const err = new Error('You are not allowed to create payment for this order');
                err.statusCode = 403;
                throw err;
            }
        }

        const amount = Number(order.finalPrice ?? order.totalPrice ?? 0);
        if (amount <= 0) {
            const err = new Error('Order total must be greater than 0 to pay with MoMo');
            err.statusCode = 400;
            throw err;
        }

        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const endpoint = process.env.MOMO_ENDPOINT;
        const redirectUrl = process.env.MOMO_REDIRECT_URL;
        const ipnUrl = process.env.MOMO_IPN_URL;

        if (!partnerCode || !accessKey || !secretKey || !endpoint || !redirectUrl || !ipnUrl) {
            const err = new Error('Missing MoMo sandbox credentials in environment variables');
            err.statusCode = 500;
            throw err;
        }

        const requestType = 'captureWallet';
        const orderInfo = `Thanh toan don hang ${order._id}`;
        const requestId = `${partnerCode}_${Date.now()}`;
        const providerOrderId = `${order._id}_${Date.now()}`;
        const extraData = '';

        const rawSignature = buildMomoCreateSignature({
            accessKey,
            amount,
            extraData,
            ipnUrl,
            orderId: providerOrderId,
            orderInfo,
            partnerCode,
            redirectUrl,
            requestId,
            requestType,
        });
        const signature = signSha256(rawSignature, secretKey);

        const response = await postJson(endpoint, {
            partnerCode,
            partnerName: 'Shurima Shop',
            storeId: 'ShurimaShop',
            requestId,
            amount: String(amount),
            orderId: providerOrderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang: 'vi',
            requestType,
            autoCapture: true,
            extraData,
            orderGroupId: '',
            signature,
        });

        if (Number(response.resultCode) !== 0 || !response.payUrl) {
            const err = new Error(response.message || 'Failed to create MoMo payment');
            err.statusCode = 400;
            throw err;
        }

        const payment = await Payment.findOneAndUpdate(
            { order: orderId },
            {
                order: orderId,
                method: 'momo',
                status: 'pending',
                requestId,
                providerOrderId,
                payUrl: response.payUrl,
                deeplink: response.deeplink || null,
                qrCodeUrl: response.qrCodeUrl || null,
                rawProviderResponse: response,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return {
            payment,
            payUrl: response.payUrl,
            deeplink: response.deeplink || null,
            qrCodeUrl: response.qrCodeUrl || null,
            requestId,
            providerOrderId,
        };
    },

    HandleMomoIpn: async function (payload) {
        const secretKey = process.env.MOMO_SECRET_KEY;

        if (!secretKey) {
            return { resultCode: 99, message: 'Missing MoMo secret key on server' };
        }

        const rawSignature = buildMomoIpnSignature(payload);
        const expectedSignature = signSha256(rawSignature, secretKey);

        if (expectedSignature !== payload.signature) {
            return { resultCode: 97, message: 'Invalid signature' };
        }

        const isPaid = Number(payload.resultCode) === 0;
        const status = isPaid ? 'paid' : 'failed';

        const payment = await Payment.findOneAndUpdate(
            {
                $or: [
                    { requestId: payload.requestId },
                    { providerOrderId: payload.orderId },
                ]
            },
            {
                status,
                providerTxnId: payload.transId ? String(payload.transId) : null,
                rawProviderResponse: payload,
            },
            { new: true }
        );

        if (!payment) {
            return { resultCode: 1, message: 'Payment not found' };
        }

        return { resultCode: 0, message: 'Success' };
    },

    GetAllPayments: async function () {
        return await Payment.find().populate('order');
    },
    GetPaymentById: async function (id, actor) {
        const payment = await Payment.findById(id).populate('order');

        if (!payment) {
            return null;
        }

        if (actor && actor.role !== 'admin' && String(payment.order?.user) !== String(actor.id)) {
            const err = new Error('You are not allowed to access this payment');
            err.statusCode = 403;
            throw err;
        }

        return payment;
    },
    GetPaymentByOrder: async function (orderId, actor) {
        const payment = await Payment.findOne({ order: orderId }).populate('order');

        if (!payment) {
            return null;
        }

        if (actor && actor.role !== 'admin' && String(payment.order?.user) !== String(actor.id)) {
            const err = new Error('You are not allowed to access this payment');
            err.statusCode = 403;
            throw err;
        }

        return payment;
    },
    UpdatePaymentStatus: async function (id, status) {
        return await Payment.findByIdAndUpdate(id, { status }, { new: true });
    },
    UpdateStatusByOrderId: async function (orderId, status) {
        return await Payment.findOneAndUpdate({ order: orderId }, { status }, { new: true });
    }
};
