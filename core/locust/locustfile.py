from locust import HttpUser, task


class QuickstartUser(HttpUser):

    def on_start(self):
        response = self.client.post(
            "/accounts/api/v1/jwt/login/",
            data={"email": "admin@admin.com", "password": "123"},
        ).json()
        self.client.headers = {
            "Authorization": f"Bearer {response.get('access', None)}"
        }

    @task
    def todo_page(self):
        self.client.get("/tasks/api/v1/tasks/")
