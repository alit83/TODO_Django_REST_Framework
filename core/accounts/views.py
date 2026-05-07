from django.shortcuts import render
from django.http import HttpResponseRedirect


def loginView(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/")
    else:
        return render(request, "accounts/login.html")