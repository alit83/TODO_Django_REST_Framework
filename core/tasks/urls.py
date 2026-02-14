from django.urls import path, include

from . import views
app_name='tasks'

urlpatterns=[
    path('api/v1/',include('tasks.api.v1.urls')),
    path('test/',views.testview,name='test')
]
       