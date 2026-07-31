import { serve } from "https://deno.land/std@0.192.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const lead = await req.json()

    // 1. Initialize Supabase client using Service Role to fetch settings
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Fetch the notification email from company_settings
    const { data: settings, error: settingsError } = await supabase
      .from('company_settings')
      .select('notification_email, company_name')
      .limit(1)
      .single()

    if (settingsError) {
      console.error("Settings Error:", JSON.stringify(settingsError, null, 2));

      return new Response(
        JSON.stringify(settingsError, null, 2),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    console.log("SUPABASE_URL exists:", !!supabaseUrl);
    console.log("SERVICE_ROLE_KEY exists:", !!supabaseServiceKey);
    const notificationEmail = settings?.notification_email
    const companyName = settings?.company_name || "NSS Home Designs"

    if (!notificationEmail) {
      console.log("No notification email configured. Skipping.")
      return new Response("No notification email configured", { headers: corsHeaders, status: 200 })
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing from environment variables.")
      return new Response("Missing API key", { headers: corsHeaders, status: 500 })
    }

    // 3. Construct the email content
    const whatsappLink = `https://wa.me/${(lead.phone || '').replace(/\D/g, '')}`
    const subject = `New Lead: ${lead.name} — ${lead.service || 'General Inquiry'}`

    let html = `
      <h2>New Lead Received</h2>
      <p>A new lead has just submitted their details on the website.</p>
      
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <th style="text-align: left; background-color: #f4f4f5; width: 30%;">Name</th>
          <td>${lead.name || ''}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #f4f4f5;">Phone</th>
          <td><a href="tel:${lead.phone || ''}">${lead.phone || ''}</a></td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #f4f4f5;">Email</th>
          <td>${lead.email || '<i>Not provided</i>'}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #f4f4f5;">Service</th>
          <td>${lead.service || '<i>Not specified</i>'}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #f4f4f5;">Budget</th>
          <td>${lead.budget || '<i>Not specified</i>'}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #f4f4f5;">Location</th>
          <td>${lead.location || '<i>Not provided</i>'}</td>
        </tr>
    `

    if (lead.preferredDate) {
      html += `
        <tr>
          <th style="text-align: left; background-color: #f4f4f5;">Requested Date</th>
          <td>${lead.preferredDate} at ${lead.preferredTime || 'Any time'}</td>
        </tr>
      `
    }

    html += `
        <tr>
          <th style="text-align: left; background-color: #f4f4f5;">Message</th>
          <td>${lead.message ? lead.message.replace(/\n/g, '<br>') : '<i>None</i>'}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #f4f4f5;">Source</th>
          <td>${lead.source || 'Website'}</td>
        </tr>
      </table>
      
      <br>
      <a href="${whatsappLink}" style="display: inline-block; padding: 10px 20px; background-color: #25D366; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Message on WhatsApp
      </a>
      <a href="mailto:${lead.email || ''}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-left: 10px;">
        Send Email
      </a>
    `

    // 4. Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${companyName} <onboarding@resend.dev>`,
        to: [notificationEmail],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      console.log("Email sent successfully:", data)
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    } else {
      console.error("Error from Resend:", data)
      return new Response(JSON.stringify(data), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
  } catch (err: any) {
    console.error("Edge Function error:", err)
    return new Response(String(err?.message ?? err), { headers: corsHeaders, status: 500 })
  }
})
