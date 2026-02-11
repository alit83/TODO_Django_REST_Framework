from django.urls import path, include

app_name='api-v1'

urlpatterns = [
    path("api/v1/", include("accounts.api.v1.urls")),
]
