# Import necessary libraries
import streamlit as st

def get_player_names(num_players):
    """
    Get the names of players from the user.
    """
    player_names = []
    for i in range(num_players):
        name = st.text_input(f"Enter name of player {i+1}:", key=f"player_name_{i}")
        player_names.append(name)
    return player_names

def get_amounts_in(player_names):
    """
    Get the amounts in for each player.
    """
    amounts_in = {}
    for i, name in enumerate(player_names):
        in_amount = st.number_input(f"Enter amount in for {name}:", value=0.0, step=1.0, key=f"amount_in_{i}")
        amounts_in[name] = in_amount
    return amounts_in

def get_amounts_out(player_names):
    """
    Get the amounts out for each player.
    """
    amounts_out = {}
    for i, name in enumerate(player_names):
        out_amount = st.number_input(f"Enter amount out for {name}:", value=0.0, step=1.0, key=f"amount_out_{i}")
        amounts_out[name] = out_amount
    return amounts_out

def calculate_balances(amounts_in, amounts_out):
    """
    Calculate the balances for each player.
    """
    balances = {}
    for name in amounts_in.keys():
        balances[name] = amounts_in[name] - amounts_out[name]
    return balances

def settle_balances(balances):
    """
    Determine who owes whom and by how much.
    """
    transactions = []
    while True:
        positive_balances = {name: balance for name, balance in balances.items() if balance > 0}
        negative_balances = {name: balance for name, balance in balances.items() if balance < 0}
        if not positive_balances or not negative_balances:
            break
        payer = min(positive_balances, key=positive_balances.get)
        payee = min(negative_balances, key=negative_balances.get)
        amount = min(positive_balances[payer], -negative_balances[payee])
        transactions.append((payer, payee, amount))
        balances[payer] -= amount
        balances[payee] += amount
    return transactions

def main():
    st.title("Expense Balancer")

    num_players = st.number_input("Enter the number of players:", min_value=2, value=2, step=1)
    player_names = get_player_names(num_players)
    amounts_in = get_amounts_in(player_names)
    amounts_out = get_amounts_out(player_names)
    balances = calculate_balances(amounts_in, amounts_out)
    transactions = settle_balances(balances)

    st.subheader("Settlements:")
    for payer, payee, amount in transactions:
        st.write(f"{payer} owes {payee} ${amount:.2f}")

    # Check if there are any unaccounted expenses
    unaccounted_expenses = sum(balances.values())
    if unaccounted_expenses != 0:
        st.warning(f"Unaccounted expenses: ${unaccounted_expenses:.2f}")

if __name__ == "__main__":
    main()
