"""
Tests for util functions
"""

from unittest import TestCase

from profiles.util import split_name


# pylint: disable=no-self-use
class UtilTests(TestCase):
    """
    Tests for util functions
    """

    def test_split_name_none(self):
        """
        None should be treated like an empty string
        """
        first_name, last_name = split_name(None)
        assert first_name == ""
        assert last_name == ""

    def test_split_name_empty(self):
        """
        split_name should always return two parts
        """
        first_name, last_name = split_name("")
        assert first_name == ""
        assert last_name == ""

    def test_split_name_one(self):
        """
        Split name should have the name as the first tuple item
        """
        first_name, last_name = split_name("one")
        assert first_name == "one"
        assert last_name == ""

    def test_split_name_two(self):
        """
        Split name with two names
        """
        first_name, last_name = split_name("two names")
        assert first_name == "two"
        assert last_name == "names"

    def test_split_name_more_than_two(self):
        """
        Split name should be limited to two names
        """
        first_name, last_name = split_name("three names here")
        assert first_name == "three"
        assert last_name == "names here"
