from rest_framework.test import APIClient
import pytest
from django.urls import reverse

@pytest.fixture
def api_client():
    clinet=APIClient()
    return clinet

@pytest.mark.django_db
class TestTodo:
    def test_get_todo_anonymous_response_401(self,api_client):
        url=reverse('tasks:todo:todo-list')
        client=api_client
        response=client.get(url)
        assert response.status_code == 401