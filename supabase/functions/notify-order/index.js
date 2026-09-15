// Supabase Edge Function: notify-order
// Deploy with: supabase functions deploy notify-order
//
// Environment variables needed in Supabase Dashboard > Functions > Secrets:
//   RESEND_API_KEY      - your Resend.com API key (or other email provider)
//   NOTIFICATION_FROM   - sender email e.g. orders@lotosphere.com
//   ADMIN_EMAIL         - admin notification recipient
//
// This function listens for pending notification_log entries and sends emails.
// It can be triggered via:
//   1. Supabase Webhook (Database -> Webhooks -> on INSERT to notification_log)
//   2. Direct HTTP call from your backend/CRON

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const body = await req.json()
    const { notification_id } = body

    // Fetch the notification
    const { data: notification, error: fetchError } = await supabaseAdmin
      .from('notification_log')
      .select(`
        *,
        orders (
          id, customer_name, email, phone,
          address, city, state, pincode,
          total_amount, status, created_at,
          order_items (
            product_name, quantity, unit_price
          )
        )
      `)
      .eq('id', notification_id)
      .single()

    if (fetchError || !notification) {
      throw new Error(`Notification not found: ${fetchError?.message}`)
    }

    const order = notification.orders
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('NOTIFICATION_FROM') ?? 'orders@lotosphere.com'

    if (!RESEND_API_KEY) {
      // Log the notification event but don't fail — email provider not configured yet
      console.log('📧 Notification event (no email provider configured):', {
        type: notification.type,
        recipient: notification.recipient,
        orderId: notification.order_id,
      })

      // Mark as pending (will retry when email provider is configured)
      await supabaseAdmin
        .from('notification_log')
        .update({ status: 'pending', error: 'Email provider not configured' })
        .eq('id', notification_id)

      return new Response(
        JSON.stringify({ success: true, message: 'Notification logged (no email provider)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build email content
    let subject = ''
    let htmlContent = ''

    if (notification.type === 'order_confirmed') {
      subject = `Order Confirmed — Lotosphere #${order.id.slice(0, 8).toUpperCase()}`
      htmlContent = buildCustomerEmail(order)
    } else if (notification.type === 'new_order_admin') {
      subject = `New Order Received — #${order.id.slice(0, 8).toUpperCase()}`
      htmlContent = buildAdminEmail(order)
    }

    // Send via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: notification.recipient,
        subject,
        html: htmlContent,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Email send failed: ${errorText}`)
    }

    // Mark as sent
    await supabaseAdmin
      .from('notification_log')
      .update({ status: 'sent', error: null })
      .eq('id', notification_id)

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Notification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function buildCustomerEmail(order) {
  const itemsHtml = order.order_items
    .map(item => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0ebe3;">${item.product_name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0ebe3; text-align:center;">${item.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0ebe3; text-align:right;">₹${(item.unit_price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Georgia, serif; background: #faf9f6; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
        <div style="background: #1a2e1a; padding: 40px; text-align: center;">
          <h1 style="color: #f0ebe3; font-family: Georgia, serif; margin: 0; font-size: 28px; letter-spacing: 2px;">LOTOSPHERE</h1>
          <p style="color: #a8c5a0; margin: 8px 0 0; font-size: 14px;">Premium Plant Marketplace</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #1a2e1a; font-size: 22px;">Your order is confirmed! 🌿</h2>
          <p style="color: #4a4a4a;">Hi ${order.customer_name}, thank you for your order. We're preparing your plants with care.</p>
          <p style="color: #4a4a4a;"><strong>Order ID:</strong> #${order.id.slice(0,8).toUpperCase()}</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #1a2e1a;">
                <th style="text-align:left; padding-bottom: 8px; color: #1a2e1a;">Item</th>
                <th style="text-align:center; padding-bottom: 8px; color: #1a2e1a;">Qty</th>
                <th style="text-align:right; padding-bottom: 8px; color: #1a2e1a;">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="text-align:right; font-size: 18px; font-weight: bold; color: #1a2e1a;">Total: ₹${order.total_amount.toLocaleString('en-IN')}</p>
          <div style="background: #f0ebe3; padding: 20px; border-radius: 8px; margin-top: 24px;">
            <h3 style="color: #1a2e1a; margin: 0 0 8px;">Delivery Address</h3>
            <p style="margin: 0; color: #4a4a4a;">${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
          </div>
        </div>
        <div style="background: #f0ebe3; padding: 24px; text-align: center;">
          <p style="color: #6b7c6b; font-size: 13px; margin: 0;">Questions? Reply to this email or visit lotosphere.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function buildAdminEmail(order) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>New Order Received — #${order.id.slice(0,8).toUpperCase()}</h2>
      <p><strong>Customer:</strong> ${order.customer_name} (${order.email})</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
      <p><strong>Total:</strong> ₹${order.total_amount.toLocaleString('en-IN')}</p>
      <p><strong>Items:</strong></p>
      <ul>${order.order_items.map(i => `<li>${i.product_name} x${i.quantity}</li>`).join('')}</ul>
      <p>View in admin: <a href="${Deno.env.get('APP_URL') ?? 'http://localhost:5173'}/admin/orders/${order.id}">Open Order</a></p>
    </body>
    </html>
  `
}
