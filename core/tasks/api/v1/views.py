from rest_framework import generics
from ...models import Tasks, Done
from .serializers import TasksSerializer, DoneSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import redirect


class ListApiCreate(generics.GenericAPIView):
    authentication_classes=[TokenAuthentication]
    permission_classes =[IsAuthenticated]
    serializer_class = TasksSerializer

    def get(self, request):
        users = request.user
        tasks = Tasks.objects.filter(user=users)
        dones = Done.objects.filter(user=users)
        task_serializer = TasksSerializer(
            tasks, many=True, context={"request": request}
        )
        done_serializer = DoneSerializer(dones, many=True)
        return Response(
            {
                "TASKS": task_serializer.data,
                "DONE": done_serializer.data,
            }
        )

    def post(self, request, *args, **kwargs):
        serializer = TasksSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return redirect("/tasks/api/v1/tasks")


class DoneApiView(generics.DestroyAPIView):
    permission_classes =[IsAuthenticated]
    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()

    def perform_destroy(self, instance):
        Done.objects.create(user=self.request.user, done=instance.todo)
        super().perform_destroy(instance)


class DeleteApiView(generics.DestroyAPIView):
    permission_classes =[IsAuthenticated]
    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()
