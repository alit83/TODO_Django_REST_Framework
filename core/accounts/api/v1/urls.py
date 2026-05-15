from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

app_name='api-v1'

urlpatterns = [
    path("registration/", views.SignUpApiView.as_view(), name="signup"),
    path("jwt/login/", views.LoginApiView.as_view(), name="login"),
    path("jwt/refresh-token/", TokenRefreshView.as_view(), name="refresh-token"),
    path("jwt/verify/", TokenVerifyView.as_view(), name="verify-token"),
    path(
        "verify-email/<uidb64>/<token>/",
        views.VerifyEmailView.as_view(),
        name="verify-email",
    ),
    path('verify-email-resend/',views.VerifyEmailResendView.as_view(),name='verify-email-resend'),
    path("forget-password/", views.ForgetPasswordView.as_view(), name="forget-password"),
    path(
        "reset-password/<uidb64>/<token>/",
        views.PasswordResetView.as_view(),
        name="reset-password",
    ),
]
