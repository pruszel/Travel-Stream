import pytest
from travel_stream.utils import parse_comma_separated_str, parse_name_email_pair_str


@pytest.mark.parametrize(
    "input_str,expected",
    [
        ("", []),
        (",", []),
        (",,", []),
        ("localhost", ["localhost"]),
        ("localhost,example.com", ["localhost", "example.com"]),
        ("localhost, example.com", ["localhost", "example.com"]),
        ("  localhost  ,  example.com  ", ["localhost", "example.com"]),
        (",example.com", ["example.com"]),
        ("example.com,", ["example.com"]),
        (",,example.com,,test.com,,", ["example.com", "test.com"]),
        ("  ,  ,  example.com  ,  ,  ", ["example.com"]),
    ],
)
def test_parse_comma_separated_str(input_str: str, expected: list[str]) -> None:
    """Test the parse_comma_separated_str function with various inputs."""
    assert parse_comma_separated_str(input_str) == expected


@pytest.mark.parametrize(
    "input_str,expected",
    [
        # Valid inputs
        (
            "John Doe,john@example.com;Jane Doe,jane@example.com",
            [("John Doe", "john@example.com"), ("Jane Doe", "jane@example.com")],
        ),
        # Single pair
        (
            "John Doe,john@example.com",
            [("John Doe", "john@example.com")],
        ),
        # Extra whitespace
        (
            "  John Doe  ,  john@example.com  ;  Jane Doe  ,  jane@example.com  ",
            [("John Doe", "john@example.com"), ("Jane Doe", "jane@example.com")],
        ),
        ("", []),
        ("   ", []),
        # Empty sections should be ignored
        (
            "John Doe,john@example.com;;;Jane Doe,jane@example.com",
            [("John Doe", "john@example.com"), ("Jane Doe", "jane@example.com")],
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
        # Missing email
        (
            "John Doe",
            "Invalid name-email pair 'John Doe'. Each pair must have exactly two parts",
        ),
        # Too many parts in one pair
        (
            "John Doe,john@example.com,extra;Jane Doe,jane@example.com",
            (
                "Invalid name-email pair 'John Doe,john@example.com,extra'. "
                "Each pair must have exactly two parts"
            ),
        ),
        # Empty parts
        (
            "John Doe,;Jane Doe,jane@example.com",
            (
                "Invalid name-email pair 'John Doe,'. "
                "Each pair must have exactly two parts"
            ),
        ),
        # Just commas
        (
            ",,,",
            "Invalid name-email pair ',,,'. Each pair must have exactly two parts",
        ),
        # Just semicolons - this is actually valid - all empty pairs are filtered out
        (
            ";;;",
            [],
        ),
    ],
)
def test_parse_name_email_pair_str_invalid(input_str: str, error_message: str) -> None:
    """Test parse_name_email_pair_str function with invalid inputs."""
    if error_message == []:  # Special case for valid but empty result
        assert parse_name_email_pair_str(input_str) == []
    else:
        with pytest.raises(ValueError, match=error_message):
            parse_name_email_pair_str(input_str)
