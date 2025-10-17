from colorama import Fore, Style

def log_message(method, message):
    print(f"{Fore.YELLOW}{method}{Style.RESET_ALL}: {message}")