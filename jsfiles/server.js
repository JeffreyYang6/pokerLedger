require('dotenv').config()
const express = require('express');
const path = require('path');
const paypal = require('./public/paypal')

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index.html')
})

app.post('/calculate', (req, res) => {
    let player_names = req.body.player_names;
    let amounts_in = req.body.amounts_in;
    let amounts_out = req.body.amounts_out;

    // Your functions here...
    let balances = calculate_balances(amounts_in, amounts_out);
    let transactions = settle_balances(balances);

    res.json(transactions);
});

let emails = [];
let amounts = [];

app.post('/emails', (req, res) => {
    emails = Object.values(req.body);
    console.log(emails);
    res.sendStatus(200);
});

app.post('/amounts', (req, res) => {
    amounts = Object.values(req.body)
    console.log(amounts)
    res.sendStatus(200)
})

app.post('/sendMoney', async (req, res) => {
    let allSuccess = true
    for (let i = 0; i < emails.length; i++) {
        try {
            await paypal.payOut(emails[i], amounts[i]);
            console.log(`Payout successful for ${emails[i]}`);
        } catch (error) {
            console.error(`Payout failed for ${emails[i]}`, error);
            allSuccess = false
        }
    }
    if (allSuccess) {
        res.redirect('/payout-complete');
    } else {
        res.status(500).send('Not all payouts were successful');
    }
});

app.get('/payout-complete', (req, res) => {
    res.redirect('payout-complete.html')
}),

app.listen(3000, () => console.log('Server started on port 3000'));
