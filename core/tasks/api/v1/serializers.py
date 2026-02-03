from rest_framework import serializers
from ...models import Tasks , Done
from rest_framework.reverse import reverse
class TasksSerializer(serializers.ModelSerializer):
    done_url = serializers.SerializerMethodField()
    delete_url = serializers.SerializerMethodField()
    class Meta:
        model = Tasks
        fields = ['todo','done_url','delete_url']
    def get_done_url(self,obj):
        request=self.context.get('request')
        return reverse('tasks:done',kwargs={'pk':obj.id},request=request)
    
    def get_delete_url(self,obj):
        request=self.context.get('request')
        return reverse('tasks:delete',kwargs={'pk':obj.id},request=request)


    def create(self,validated_data):
        validated_data['user']=(self.context.get('request')).user
        return super().create(validated_data)


class DoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Done
        fields = ['done',]