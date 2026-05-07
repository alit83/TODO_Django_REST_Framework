from django.urls import path
from . import views
app_name='todo'
urlpatterns=[
    path('tasks/',views.ListCreateTodoApiView.as_view(),name='todo-list'),
    path('done/<int:pk>/',views.DoneApiView.as_view(),name='done'),
    path('delete/<int:pk>/',views.DeleteApiView.as_view(),name='delete')
]