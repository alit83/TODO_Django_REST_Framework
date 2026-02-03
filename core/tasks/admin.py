from django.contrib import admin
from .models import Tasks , Done
# Register your models here.
class TasksAdmin(admin.ModelAdmin):
    list_display =['todo',]

admin.site.register(Tasks,TasksAdmin)
admin.site.register(Done)
