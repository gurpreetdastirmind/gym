const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const sendEmail = require('../utils/sendEmail');

// ✅ DEPLOY: centralize frontend URL so emails stop pointing at localhost
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ✅ 1. Place Order (Checkout)
exports.createOrder = async (req, res) => {
  try {
    const {
      orderNumber, userEmail, userPhone, shippingAddress, items,
      subtotal, shippingCharge, codCharge, discount, totalAmount,
      paymentMethod, couponCode,
    } = req.body;

    const order = await Order.create({
      orderNumber, userEmail, userPhone, shippingAddress, items,
      subtotal, shippingCharge, codCharge, discount, totalAmount,
      paymentMethod, couponCode,
      status: 'Processing',
    });

    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode } });
      if (coupon) {
        const usedBy = coupon.usedBy || [];
        // ✅ DEPLOY: trim + lowercase for case-insensitive match
        const normalizedEmail = userEmail.trim().toLowerCase();
        if (!usedBy.includes(normalizedEmail)) {
          usedBy.push(normalizedEmail);
          coupon.usedBy = usedBy;
          await coupon.save();
        }
      }
    }

    // ✅ DEPLOY: Postgres DECIMAL returns strings → coerce to Number for math + display
    const itemsHtml = items
      .map((item) => {
        const lineTotal = Number(item.price) * Number(item.quantity);
        return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${lineTotal.toFixed(2)}</td>
      </tr>`;
      })
      .join('');

    const displayTotal = Number(totalAmount).toFixed(2);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #009e3e;">Order Confirmed! 🎉</h2>
        <p>Hi <strong>${shippingAddress.name}</strong>,</p>
        <p>Thank you for shopping with i7 Nutrition. Your order has been successfully placed.</p>

        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${displayTotal}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>

        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>

        <h3 style="margin-top: 20px;">Shipping Address:</h3>
        <p style="color: #555;">
          ${shippingAddress.flat}, ${shippingAddress.area}<br/>
          ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}
        </p>

        <p style="margin-top: 30px;">You can track your order anytime by visiting our
          <a href="${FRONTEND_URL}/track-order" style="color: #009e3e;">Track Order page</a>.
        </p>

        <p style="color: #888; font-size: 12px; margin-top: 30px;">Team i7 Nutrition 💚</p>
      </div>
    `;

    await sendEmail(userEmail, `Order Confirmed - ${orderNumber}`, emailHtml);

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing order' });
  }
};

// ✅ 2. Track Order (Public)
exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber, email } = req.body;
    const order = await Order.findOne({
      where: { orderNumber, userEmail: email },
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found. Check details again.' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 3. Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 4. User Requests Cancellation
exports.requestCancel = async (req, res) => {
  try {
    const { orderNumber, email, reason } = req.body;
    const order = await Order.findOne({
      where: { orderNumber, userEmail: email },
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel order after it has been shipped.' });
    }
    if (order.cancelStatus === 'Requested') {
      return res.status(400).json({ message: 'Cancellation already requested.' });
    }

    await order.update({ cancelReason: reason, cancelStatus: 'Requested' });

    await sendEmail(
      email,
      `Cancellation Request Received - ${orderNumber}`,
      `<div style="font-family: Arial; padding: 20px;">
        <h2 style="color: #ff9800;">Cancellation Request Received ⏳</h2>
        <p>We have received your cancellation request for Order <strong>${orderNumber}</strong>.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Our team will review your request and update you shortly.</p>
        <p>Team i7 Nutrition 💚</p>
      </div>`
    );

    res.json({ message: 'Cancellation requested successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 5. Admin Approves/Rejects Cancellation
exports.handleCancelRequest = async (req, res) => {
  try {
    const { action } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (action === 'Approve') {
      await order.update({ status: 'Cancelled', cancelStatus: 'Approved' });

      await sendEmail(
        order.userEmail,
        `Order Cancelled - ${order.orderNumber}`,
        `<div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #dc2626;">Order Cancelled ❌</h2>
          <p>Hi, your order <strong>${order.orderNumber}</strong> has been successfully cancelled.</p>
          <p>If you have paid online, refunds (if any) will be processed within 5-7 business days.</p>
          <p>Team i7 Nutrition 💚</p>
        </div>`
      );
    } else {
      await order.update({ cancelStatus: 'Rejected' });

      await sendEmail(
        order.userEmail,
        `Cancellation Request Declined - ${order.orderNumber}`,
        `<div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #333;">Cancellation Request Declined</h2>
          <p>Sorry! We could not approve your cancellation request for Order <strong>${order.orderNumber}</strong>.</p>
          <p>For any questions, please contact support.</p>
          <p>Team i7 Nutrition 💚</p>
        </div>`
      );
    }
    res.json({ message: `Order cancellation ${action.toLowerCase()}d`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 6. Admin Updates Status (Shipped / Delivered, etc.)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update({ status });

    if (status === 'Shipped') {
      await sendEmail(
        order.userEmail,
        `Your Order is Shipped! 🚚 - ${order.orderNumber}`,
        `<div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #009e3e;">Your order is on its way! 🚚</h2>
          <p>Good news! Order <strong>${order.orderNumber}</strong> has been shipped.</p>
          <p>Track it anytime from our <a href="${FRONTEND_URL}/track-order">Track Order page</a>.</p>
          <p>Team i7 Nutrition 💚</p>
        </div>`
      );
    } else if (status === 'Out for Delivery') {
      await sendEmail(
        order.userEmail,
        `Out for Delivery Today - ${order.orderNumber}`,
        `<div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #009e3e;">Your order will arrive today! 🚴</h2>
          <p>Order <strong>${order.orderNumber}</strong> is out for delivery.</p>
          <p>Please keep your phone handy.</p>
          <p>Team i7 Nutrition 💚</p>
        </div>`
      );
    } else if (status === 'Delivered') {
      await sendEmail(
        order.userEmail,
        `Order Delivered - ${order.orderNumber}`,
        `<div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #009e3e;">Order Delivered ✅</h2>
          <p>Your order <strong>${order.orderNumber}</strong> has been delivered successfully.</p>
          <p>We'd love to hear your feedback!</p>
          <p>Team i7 Nutrition 💚</p>
        </div>`
      );
    }

    res.json({ message: 'Status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};