from rest_framework import generics
from ...models import Tasks
from .serializers import TasksSerializer
from rest_framework.response import Response
class ListCreateAPI(generics.ListCreateAPIView):
    serializer_class = TasksSerializer
    def get_queryset(self):
        queryset = Tasks.objects.filter(user=self.request.user)
        return queryset

class DoneViewAPI(generics.DestroyAPIView):
    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()
    def perform_destroy(self,instance):
        Tasks.objects.create(user=self.request.user,done=instance.todo)
        super().perform_destroy(instance)