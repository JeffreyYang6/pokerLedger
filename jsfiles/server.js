const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/calculate', (req, res) => {
    let player_names = req.body.player_names;
    let amounts_in = req.body.amounts_in;
    let amounts_out = req.body.amounts_out;

    // Your functions here...
    let balances = calculate_balances(amounts_in, amounts_out);
    let transactions = settle_balances(balances);

    res.json(transactions);
});

app.listen(3000, () => console.log('Server started on port 3000'));
