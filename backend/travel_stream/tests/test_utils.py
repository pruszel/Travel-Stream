import pytest
from travel_stream.utils import parse_comma_separated_str, parse_name_email_pair_str


@pytest.mark.parametrize(
    "input_str,expected",
    [
        pytest.param("", [], id="empty string"),
        pytest.param(",", [], id="comma-separated string"),
        pytest.param(",,", [], id="empty values"),
        pytest.param("localhost", ["localhost"], id="single value"),
        pytest.param(
            "localhost,example.com", ["localhost", "example.com"], id="multiple values"
        ),
        pytest.param(
            "localhost, example.com",
            ["localhost", "example.com"],
            id="whitespace between values",
        ),
        pytest.param(
            "  localhost  ,  example.com  ",
            ["localhost", "example.com"],
            id="whitespace around values",
        ),
        pytest.param(",example.com", ["example.com"], id="empty value at start"),
        pytest.param("example.com,", ["example.com"], id="empty value at end"),
        pytest.param(
            ",,example.com,,test.com,,",
            ["example.com", "test.com"],
            id="multiple empty values",
        ),
        pytest.param(
            "  ,  ,  example.com  ,  ,  ",
            ["example.com"],
            id="multiple empty values with whitespace around them",
        ),
    ],
)
def test_parse_comma_separated_str(input_str: str, expected: list[str]) -> None:
    """Test the parse_comma_separated_str function with various inputs."""
    assert parse_comma_separated_str(input_str) == expected


@pytest.mark.parametrize(
    "input_str,expected",
    [
        pytest.param(
            "John Doe,john@example.com;Jane Doe,jane@example.com",
            [("John Doe", "john@example.com"), ("Jane Doe", "jane@example.com")],
            id="valid inputs",
        ),
        pytest.param(
            "John Doe,john@example.com",
            [("John Doe", "john@example.com")],
            id="single pair",
        ),
        pytest.param(
            "  John Doe  ,  john@example.com  ;  Jane Doe  ,  jane@example.com  ",
            [("John Doe", "john@example.com"), ("Jane Doe", "jane@example.com")],
            id="extra whitespace",
        ),
        pytest.param("", [], id="empty string"),
        pytest.param("   ", [], id="whitespace only"),
        pytest.param(
            "John Doe,john@example.com;;;Jane Doe,jane@example.com",
            [("John Doe", "john@example.com"), ("Jane Doe", "jane@example.com")],
            id="empty sections ignored",
        ),
    ],
)
def test_parse_name_email_pair_str_valid(
    input_str: str, expected: list[tuple[str, str]]
) -> None:
    """Test parse_name_email_pair_str function with valid inputs."""
    assert parse_name_email_pair_str(input_str) == expected


@pytest.mark.parametrize(
    "input_str,error_message",
    [
        pytest.param(
            "John Doe",
            "Invalid name-email pair 'John Doe'. Each pair must have exactly two parts",
            id="missing email",
        ),
        pytest.param(
            "John Doe,john@example.com,extra;Jane Doe,jane@example.com",
            (
                "Invalid name-email pair 'John Doe,john@example.com,extra'. "
                "Each pair must have exactly two parts"
            ),
            id="too many parts",
        ),
        pytest.param(
            "John Doe,;Jane Doe,jane@example.com",
            (
                "Invalid name-email pair 'John Doe,'. "
                "Each pair must have exactly two parts"
            ),
            id="empty parts",
        ),
        pytest.param(
            ",,,",
            "Invalid name-email pair ',,,'. Each pair must have exactly two parts",
            id="just commas",
        ),
        pytest.param(";;;", [], id="just semicolons"),
    ],
)
def test_parse_name_email_pair_str_invalid(input_str: str, error_message: str | list) -> None:
    """Test parse_name_email_pair_str function with invalid inputs."""
    if type(error_message) is list:  # Special case for valid but empty result
        assert parse_name_email_pair_str(input_str) == []
    else:
        with pytest.raises(ValueError, match=error_message):
            parse_name_email_pair_str(input_str)
