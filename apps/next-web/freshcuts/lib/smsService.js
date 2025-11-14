export const sendOrderConfirmationSMS = async (phone, orderDetails) => {
  try {
    const message = `Order confirmed! Order #${orderDetails.orderId.substring(0, 8)} from ${orderDetails.vendorName}. Total: ₹${orderDetails.total}. Delivery: ${orderDetails.timeSlot}. Track: freshcuts.com/orders`
    
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message })
    })
    
    return response.ok
  } catch (error) {
    console.error('SMS sending failed:', error)
    return false
  }
}

export const sendVendorNotificationSMS = async (vendorPhone, orderDetails) => {
  try {
    const message = `New order! Order #${orderDetails.orderId.substring(0, 8)} - ₹${orderDetails.total}. ${orderDetails.items.length} items. Customer: ${orderDetails.customerPhone}. Accept/Reject: freshcuts.com/vendor/orders`
    
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: vendorPhone, message })
    })
    
    return response.ok
  } catch (error) {
    console.error('Vendor SMS failed:', error)
    return false
  }
}