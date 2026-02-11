from rest_framework import generics
from ...models import Tasks, Done
from .serializers import TasksSerializer, DoneSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.shortcuts import redirect


class ListApiCreate(generics.GenericAPIView):
    permission_classes =[IsAuthenticated]
    serializer_class = TasksSerializer

    def get(self, request , *args , **kwargs):
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
            } ,
            status=status.HTTP_200_OK
        )

    def post(self, request, *args, **kwargs):
        serializer = TasksSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'details': serializer.validated_data['todo']} , status=status.HTTP_201_CREATED)


class DoneApiView(generics.DestroyAPIView):
    permission_classes =[IsAuthenticated]
    serializer_class = TasksSerializer

    def perform_destroy(self, instance):
        Done.objects.create(user=self.request.user, done=instance.todo)
        super().perform_destroy(instance)
    def get_queryset(self):
        return Tasks.objects.filter(user=self.request.user)


class DeleteApiView(generics.DestroyAPIView):
    permission_classes =[IsAuthenticated]
    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()
