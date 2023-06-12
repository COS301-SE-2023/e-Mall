from unittest.mock import MagicMock
import pytest
from .models import Consumer


# @pytest.mark.django_db
# def test_consumer_saved_without_error():
#     consumer = Consumer()
#     consumer.name = "John"
#     consumer.email = "john@example.com"
#     consumer.save()
#     assert Consumer.objects.filter(
#         name="John", email="john@example.com").exists()
# def test_consumer_creation_with_correct_data(db):
#     """Test the creation of a consumer with correct data."""

#     # Create a consumer object with correct data
#     consumer = Consumer(
#         username="johndoe",
#         email="johndoe@example.com",
#         type="consumer",
#     )

#     # Save the consumer to the database
#     db.save.assert_called_with(consumer)

#     # Assert that the consumer was created successfully
#     assert Consumer.objects.get(username="johndoe") == consumer


# def test_consumer_creation_with_incorrect_data(db):
#     """Test the creation of a consumer with incorrect data."""

#     # Create a consumer object with incorrect data
#     consumer = Consumer(
#         username="johndoe",
#         email="johndoe@example.com",
#         type="user",
#     )

#     # Save the consumer to the database
#     with pytest.raises(ValueError):
#         db.save.assert_called_with(consumer)

#     # Assert that the consumer was not created successfully
#     assert Consumer.objects.get(username="johndoe") is None
