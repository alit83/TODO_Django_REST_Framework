from django.shortcuts import render
from django.http import JsonResponse
from django.views.generic import TemplateView
# Create your views here.
from django.contrib.auth.mixins import LoginRequiredMixin
class IndexView(LoginRequiredMixin,TemplateView):
    template_name = 'todo/index.html'



