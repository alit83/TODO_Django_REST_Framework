from rest_framework.test import APIClient
import pytest
from django.urls import reverse
from accounts.models import User
from tasks.models import Tasks


@pytest.fixture
def api_client():
    clinet = APIClient()
    return clinet


@pytest.fixture
def create_user():
    user_obj = User.objects.create_user(
        email="test@test.com", password="@a12345678", is_verified=True
    )
    return user_obj


@pytest.fixture
def take_token(create_user, api_client):
    user = create_user
    data = {"email": user.email, "password": "@a12345678"}
    url = reverse("accounts:api-v1:login")
    response = api_client.post(url, data)
    return response.data


@pytest.fixture
def create_task(create_user):
    user = create_user
    task_obj = Tasks.objects.create(user=user, todo="write math")
    return task_obj


@pytest.mark.django_db
class TestTodo:
    def test_get_todo_anonymous_response_401(self, api_client):
        url = reverse("tasks:todo:todo-list")
        client = api_client
        response = client.get(url)
        assert response.status_code == 401

    def test_post_task_response_201(self, api_client, create_user, take_token):
        url = reverse("tasks:todo:todo-list")
        data = {"todo": "gohome"}
        """
        authenticate with access token
        """
        access = take_token["access"]
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        response = api_client.post(url, data)
        assert response.status_code == 201

    def test_done_a_task_successfuly(
        self, create_user, create_task, api_client
    ):
        user = create_user
        client = api_client
        client.force_authenticate(user=user)
        url = reverse("tasks:todo:done", kwargs={"pk": create_task.id})
        response = client.put(url, {"done": True})
        assert response.data["done"] is True
        assert response.status_code == 200
