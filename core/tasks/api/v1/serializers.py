from rest_framework import serializers
from ...models import Tasks
from rest_framework.reverse import reverse


class TasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = ["id","todo", 'done' ]




    def create(self, validated_data):
        validated_data["user"] = (self.context.get("request")).user
        return super().create(validated_data)

class DoneSerializer(serializers.ModelSerializer):
        class Meta:
            model = Tasks
            fields = ["todo",'done']
