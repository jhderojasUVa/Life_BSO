from logger import log_message


def test_log_message_prints_uppercase_severity(capsys) -> None:
    log_message("GET", "health check", severity="debug")

    out = capsys.readouterr().out
    assert "[DEBUG] GET" in out
    assert "health check" in out
