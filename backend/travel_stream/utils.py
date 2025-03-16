def parse_comma_separated_str(value: str) -> list[str]:
    """
    Parse a comma-separated string into a list of strings,
    stripping whitespace and filtering empty values.

    Args:
        value: A string containing comma-separated values

    Returns:
        A list of non-empty strings with whitespace stripped

    Example:
        >>> parse_comma_separated_str("localhost, example.com, test.com")
        ['localhost', 'example.com', 'test.com']
        >>> parse_comma_separated_str(",example.com,,test.com,")
        ['example.com', 'test.com']
    """
    return [s.strip() for s in value.split(",") if s.strip()]


def parse_name_email_pair_str(value: str) -> list[tuple[str, str]]:
    """
    Parse a semicolon-separated string of comma-separated name-email pairs
    into a list of tuples.
    Each pair should be in the format "name,email@example.com" with pairs
    separated by semicolons.

    Args:
        value: A string containing semicolon-separated name-email pairs

    Returns:
        A list of tuples, each containing (name, email)

    Raises:
        ValueError: If any pair doesn't contain exactly two parts (name and email)
                  or if the string is malformed

    Example:
        >>> parse_name_email_pair_str(
            "John Doe,john@example.com;Jane Doe,jane@example.com"
        )
        [('John Doe', 'john@example.com'), ('Jane Doe', 'jane@example.com')]
    """
    if not value.strip():
        return []

    result = []
    pairs = [p.strip() for p in value.split(";") if p.strip()]

    for pair in pairs:
        parts = [p.strip() for p in pair.split(",") if p.strip()]
        if len(parts) != 2:
            raise ValueError(
                f"Invalid name-email pair '{pair}'. Each pair must have exactly two "
                "parts: name and email separated by a comma"
            )
        result.append(tuple(parts))

    return result
