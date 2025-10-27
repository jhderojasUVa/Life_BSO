from colorama import Fore, Style

def log_message(method, message, severity="INFO"):
    """
    Logs a message with a color based on the severity.
    """
    color_map = {
        "INFO": Fore.BLUE,
        "WARNING": Fore.YELLOW,
        "ERROR": Fore.RED,
        "DEBUG": Fore.GREEN,
    }
    color = color_map.get(severity.upper(), Fore.WHITE)
    print(f"{color}[{severity.upper()}] {method}{Style.RESET_ALL}: {message}")
