from django.urls import path
from . import views
urlpatterns=[
    path('tasks/',views.ListCreateAPI.as_view(),name='tasks'),
    path('done/<int:pk>/',views.DoneViewAPI.as_view(),name='done')
]