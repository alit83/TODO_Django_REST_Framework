from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Tasks(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    todo=models.TextField(blank=True,null=True)
    done = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.todo