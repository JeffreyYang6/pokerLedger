const axios = require('axios')

async function generateAccessToken() {
    try {
        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
            method: 'post',
            data: 'grant_type=client_credentials',
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
            },
            withCredentials: true
        })
        return response.data.access_token
    } catch (error) {
        console.error(`Error generating access token: ${error}`);
    }
}


exports.payOut = async (email, amount) => {
    const accessToken = await generateAccessToken()

    const response = await axios({
        method: 'post',
        url: process.env.PAYPAL_BASE_URL + '/v1/payments/payouts',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        data: { 
            "sender_batch_header": { 
                "email_subject": "You have a payout!", 
                "email_message": "You have received a payout! Thanks for using our service!" 
            },
            "items": [ 
                { 
                    "recipient_type": "EMAIL", 
                    "amount": { "value": `${amount}`, "currency": "CAD" }, 
                    "receiver": `${email}` 
                }]
        }
    })

    return response.data;
}