from rest_framework import generics
from ...models import Tasks
from .serializers import TasksSerializer, DoneSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class ListCreateTodoApiView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TasksSerializer

    def get(self, request, *args, **kwargs):
        users = request.user
        tasks = Tasks.objects.filter(user=users)
        task_serializer = TasksSerializer(
            tasks, many=True, context={"request": request}
        )
        return Response(
            {
                "TASKS": task_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request, *args, **kwargs):
        serializer = TasksSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"details": serializer.validated_data["todo"]},
            status=status.HTTP_201_CREATED,
        )


class DeleteApiView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()

    def get_queryset(self, *args, **kwargs):
        return (
            super()
            .get_queryset(*args, **kwargs)
            .filter(user=self.request.user)
        )


class DoneApiView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DoneSerializer
    queryset = Tasks.objects.all()

    def get_queryset(self, *args, **kwargs):
        return (
            super()
            .get_queryset(*args, **kwargs)
            .filter(user=self.request.user)
        )
