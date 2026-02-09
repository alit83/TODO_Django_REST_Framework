from django.urls import path
from . import views

app_name = "tasks"
urlpatterns = [
    path("tasks/", views.ListApiCreate.as_view(), name="tasks"),
    path("done/<int:pk>/", views.DoneApiView.as_view(), name="done"),
    path("delete/<int:pk>/", views.DeleteApiView.as_view(), name="delete"),
]
