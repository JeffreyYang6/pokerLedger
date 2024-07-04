from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button

class ExpenseBalancerApp(App):
    def build(self):
        self.main_layout = BoxLayout(orientation="vertical")
        self.player_names = []
        self.amounts_in = {}
        self.amounts_out = {}
        self.balances = {}
        self.transactions = []

        self.num_players_input = TextInput(text='2', multiline=False)
        self.main_layout.add_widget(Label(text="Enter the number of players:"))
        self.main_layout.add_widget(self.num_players_input)

        self.calculate_button = Button(text="Calculate")
        self.calculate_button.bind(on_press=self.calculate_balances)
        self.main_layout.add_widget(self.calculate_button)

        return self.main_layout

    def calculate_balances(self, instance):
        num_players = int(self.num_players_input.text)
        self.get_player_names(num_players)
        self.get_amounts_in()
        self.get_amounts_out()
        self.settle_balances()

    def get_player_names(self, num_players):
        for i in range(num_players):
            name_input = TextInput(multiline=False)
            self.main_layout.add_widget(Label(text=f"Enter name of player {i+1}:"))
            self.main_layout.add_widget(name_input)
            self.player_names.append(name_input)

    def get_amounts_in(self):
        for name_input in self.player_names:
            in_amount_input = TextInput(text='0.0', multiline=False)
            self.main_layout.add_widget(Label(text=f"Enter amount in for {name_input.text}:"))
            self.main_layout.add_widget(in_amount_input)
            self.amounts_in[name_input.text] = float(in_amount_input.text)

    def get_amounts_out(self):
        for name_input in self.player_names:
            out_amount_input = TextInput(text='0.0', multiline=False)
            self.main_layout.add_widget(Label(text=f"Enter amount out for {name_input.text}:"))
            self.main_layout.add_widget(out_amount_input)
            self.amounts_out[name_input.text] = float(out_amount_input.text)

    def settle_balances(self):
        # Your logic for settling balances goes here
        pass

if __name__ == "__main__":
    ExpenseBalancerApp().run()

# run
