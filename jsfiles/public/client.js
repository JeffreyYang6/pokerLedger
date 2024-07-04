const readline = require('readline');
const nodemailer = require('nodemailer');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



function question(query) {
    return new Promise(resolve => rl.question(query, ans => resolve(ans)));
}

function addPlayers() {
    let numPlayers = document.getElementById('numPlayers').value;
    let playersDiv = document.getElementById('players');
    playersDiv.innerHTML = ''; // Clear the div

    let headerDiv = document.createElement('div');
    headerDiv.className = 'row mb-3';
    headerDiv.innerHTML = `
        <div class="col"><h4>Name</h4></div>
        <div class="col"><h4>Amount In</h4></div>
        <div class="col"><h4>Amount Out</h4></div>
        <div class="col"><h4>Email</h4></div>
    `;
    playersDiv.appendChild(headerDiv);

    for (let i = 0; i < numPlayers; i++) {
        let newPlayerDiv = document.createElement('div');
        newPlayerDiv.className = 'row mb-3';
        newPlayerDiv.innerHTML = `
            <div class="col"><input type="text" class="form-control" id="player${i}" placeholder="Enter name of player ${i+1}"></div>
            <div class="col"><input type="number" class="form-control" id="amountIn${i}" placeholder="Enter amount in for player ${i+1}"></div>
            <div class="col"><input type="number" class="form-control" id="amountOut${i}" placeholder="Enter amount out for player ${i+1}"></div>
            <div class="col"><input type="email" class="form-control" id="email${i}" placeholder="Enter email for player ${i+1}"></div>
        `;
        playersDiv.appendChild(newPlayerDiv);
    }
}



async function get_player_names(num_players) {
    let player_names = [];
    for (let i = 0; i < num_players; i++) {
        let name = await question(`Enter name of player ${i+1}: `);
        player_names.push(name);
    }
    return player_names;
}

async function get_amounts_in(player_names) {
    let amounts_in = {};
    for (let name of player_names) {
        let in_amount = parseFloat(await question(`Enter amount in for ${name}: `));
        amounts_in[name] = in_amount;
    }
    return amounts_in;
}

async function get_amounts_out(player_names) {
    let amounts_out = {};
    for (let name of player_names) {
        let out_amount = parseFloat(await question(`Enter amount out for ${name}: `));
        amounts_out[name] = out_amount;
    }
    return amounts_out;
}

function calculate_balances(amounts_in, amounts_out) {
    let balances = {};
    for (let name in amounts_in) {
        balances[name] = amounts_in[name] - amounts_out[name];
    }
    return balances;
}

function settle_balances(balances) {
    let transactions = [];
    while (true) {
        let positive_balances = {};
        let negative_balances = {};
        for (let name in balances) {
            if (balances[name] > 0) positive_balances[name] = balances[name];
            else if (balances[name] < 0) negative_balances[name] = balances[name];
        }
        if (Object.keys(positive_balances).length === 0 || Object.keys(negative_balances).length === 0) break;
        let payer = Object.keys(positive_balances).reduce((a, b) => positive_balances[a] < positive_balances[b] ? a : b);
        let payee = Object.keys(negative_balances).reduce((a, b) => negative_balances[a] < negative_balances[b] ? a : b);
        let amount = Math.min(positive_balances[payer], -negative_balances[payee]);
        transactions.push([payer, payee, amount]);
        balances[payer] -= amount;
        balances[payee] += amount;
    }
    return transactions;
}


async function sendEmail(to, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pokerledgerapp@gmail.com',
            pass: 'PASSWORD'
        }
    });

    let mailOptions = {
        from: '@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    let info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ' + info.response);
}


async function calculate() {
    let numPlayers = document.getElementById('numPlayers').value;
    let player_names = [];
    let amounts_in = {};
    let amounts_out = {};
    let emails = {};

    for (let i = 0; i < numPlayers; i++) {
        let name = document.getElementById(`player${i}`).value;
        player_names.push(name);
        amounts_in[name] = parseFloat(document.getElementById(`amountIn${i}`).value);
        amounts_out[name] = parseFloat(document.getElementById(`amountOut${i}`).value);
        emails[name] = document.getElementById(`email${i}`).value;
    }

    let balances = calculate_balances(amounts_in, amounts_out);
    let transactions = settle_balances(balances);

    // Clear the table body
    let tableBody = document.querySelector('#settlements tbody');
    tableBody.innerHTML = '';

    for (let [payer, payee, amount] of transactions) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${payer}</td>
            <td>${payee}</td>
            <td>$${amount.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    }

    // Check if there are any unaccounted expenses
    let unaccounted_expenses = Object.values(balances).reduce((a, b) => a + b, 0);
    if (unaccounted_expenses != 0) {
        let warningDiv = document.createElement('div');
        warningDiv.className = 'alert alert-warning';
        warningDiv.textContent = `Unaccounted expenses: $${unaccounted_expenses.toFixed(2)}`;
        document.getElementById('results').appendChild(warningDiv);
    }
}


async function main() {
    let num_players = parseInt(await question("Enter the number of players: "));
    let player_names = await get_player_names(num_players);
    let amounts_in = await get_amounts_in(player_names);
    let amounts_out = await get_amounts_out(player_names);
    let balances = calculate_balances(amounts_in, amounts_out);
    let transactions = settle_balances(balances);

    console.log("Settlements:");
    for (let [payer, payee, amount] of transactions) {
        console.log(`${payer} owes ${payee} $${amount.toFixed(2)}`);
    }

    // Check if there are any unaccounted expenses
    let unaccounted_expenses = Object.values(balances).reduce((a, b) => a + b, 0);
    if (unaccounted_expenses != 0) {
        console.warn(`Unaccounted expenses: $${unaccounted_expenses.toFixed(2)}`);
    }

    rl.close();
}

main();

