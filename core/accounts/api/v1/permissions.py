from rest_framework.permissions import BasePermission


class OnlyUnAuthenticated(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return False
        else:
            return True
