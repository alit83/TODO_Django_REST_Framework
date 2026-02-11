from django.db import models
from accounts.models import User

# Create your models here.


class Tasks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    todo = models.TextField(blank=True, null=True)

    # def __str__(self):
    #     return self.todo


class Done(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    done = models.TextField(blank=True, null=True)

    # def __str__(self):
    #     return self.done
