from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import   User
# Register your models here.

class CustomUserAdmin(UserAdmin):
    model=User
    list_display=['email','is_verified','is_superuser']
    search_fields=('email',)
    ordering=('created_date',)
    list_filter=['is_verified']
    fieldsets=(
        ('authentication',{
            'fields':('email','password'),
        }),
        ('permissions',{
            'fields':('is_staff','is_superuser','is_verified'),
        }),
        ('group_permissions',{
            'fields':('groups','user_permissions'),
        }),
        ('important_date',{
            'fields':('last_login',),

        }),
    )
    add_fieldsets=(
        ('create_user',{
            'classes':('wide',),
            'fields':('email','password1','password2','first_name','is_superuser','is_verified','is_staff')
        }),
    )
admin.site.register(User,CustomUserAdmin)

