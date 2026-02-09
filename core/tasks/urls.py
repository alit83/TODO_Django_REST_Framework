from django.urls import path, include

urlpatterns = [path("api/v1/", include("tasks.api.v1.urls"))]
