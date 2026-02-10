from django.urls import path, include


app_name='tasks'

urlpatterns=[
    path('api/v1/',include('tasks.api.v1.urls'))
]
       