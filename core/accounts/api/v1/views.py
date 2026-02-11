from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    SignUpApiserializer,
    CustomTokenObtainPairSerializer,
    ForgertPasswordSerializer,
    PasswordResetSerializer,
    VerifyEmailResendSerializer,
)
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone
from mail_templated import EmailMessage
from ..utils import VerificationThread
from .permissions import OnlyUnAuthenticated
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from accounts.models import User , EmailVerifyToken
import secrets
from hashlib import sha256
from datetime import datetime

class CustomTokenGenerator(PasswordResetTokenGenerator):
    pass


# Define a single instance of the token generator
token_generator = CustomTokenGenerator()


class SignUpApiView(generics.GenericAPIView):
    permission_classes=[OnlyUnAuthenticated]
    serializer_class = SignUpApiserializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_obj = serializer.save()
        email = user_obj.email
        raw_token=secrets.token_urlsafe(32)
        token_hash=sha256(raw_token.encode()).hexdigest()
        EmailVerifyToken.objects.create(user=user_obj,token_hash=token_hash)
        uidb64 = urlsafe_base64_encode(force_bytes(user_obj.pk))
        data = {"email": email}
        message = EmailMessage(
            "email/email-verification.tpl",
            {"token": token_hash, "uidb64": uidb64},
            "todo@todo.com",
            to=[email],
        )

        VerificationThread(message).start()
        return Response(data, status=status.HTTP_201_CREATED)


class LoginApiView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    


class VerifyEmailView(APIView):
    permission_classes=[OnlyUnAuthenticated]
    def get(self, request, token, uidb64, *args, **kwargs):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user_obj = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError):
            return Response(
                {"details": "Invalid verification link"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
                token_obj = EmailVerifyToken.objects.select_for_update().get(user=user_id , 
                                token_hash=token , used_at__isnull=True)
        except (EmailVerifyToken.DoesNotExist , ValueError):
            return Response(
                {"details": "your verification link is no longer valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        token_obj.used_at = timezone.now()
        token_obj.save()
        user_obj.is_verified = True
        user_obj.save()
        return Response(
                {"details": "your email has been verified."}, status=status.HTTP_200_OK
            )
    
class VerifyEmailResendView(generics.GenericAPIView):
    permission_classes=[OnlyUnAuthenticated]
    serializer_class=VerifyEmailResendSerializer
    def post(self,request,*args,**kwargs):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        try:
            EmailVerifyToken.objects.filter(user__email=email , used_at=None).update(used_at=timezone.now())
            user_obj=User.objects.get(email=email , is_verified=False)
        except (EmailVerifyToken.DoesNotExist , User.DoesNotExist ):
            return Response({'details': 'verfication email has been sent.'}, status=status.HTTP_200_OK)
        raw_token=secrets.token_urlsafe(32)
        token_hash=sha256(raw_token.encode()).hexdigest()
        EmailVerifyToken.objects.create(user=user_obj,token_hash=token_hash)
        uidb64 = urlsafe_base64_encode(force_bytes(user_obj.pk))
        data = {"email": email}
        message = EmailMessage(
            "email/email-verification.tpl",
            {"token": token_hash, "uidb64": uidb64},
            "todo@todo.com",
            to=[email],
        )

        VerificationThread(message).start()
        return Response(data, status=status.HTTP_201_CREATED)
        

            


class ForgetPasswordView(generics.GenericAPIView):
    permission_classes=[OnlyUnAuthenticated]
    serializer_class = ForgertPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    "details": "check your email. a password recovery email has been sent"
                },
                status=status.HTTP_200_OK,
            )
        token = token_generator.make_token(user_obj)
        uidb64 = urlsafe_base64_encode(force_bytes(user_obj.pk))
        message = EmailMessage(
            "email/email-forget-password.tpl",
            {"token": token, "uidb64": uidb64},
            "todo@todo.com",
            to=[email],
        )

        VerificationThread(message).start()
        return Response(
            {"details": "check your email. a password recovery email has been sent"},
            status=status.HTTP_200_OK,
        )


class PasswordResetView(generics.GenericAPIView):
    permission_classes=[OnlyUnAuthenticated]
    serializer_class = PasswordResetSerializer

    def get(self, request, token, uidb64, *args, **kwargs):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user_obj = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError):
            return Response(
                {"details": "Invalid reset password link"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not token_generator.check_token(user_obj, token):
            return Response(
                {"details": "your link is no longer valid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"details": "link is valid"}, status=status.HTTP_200_OK)

    def post(self, request, token, uidb64, *args, **kwargs):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user_obj = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError):
            return Response(
                {"details": "Invalid reset password link"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if token_generator.check_token(user_obj, token):
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            user_obj.set_password(serializer.validated_data["password"])
            user_obj.save()
            return Response(
                {"details": "your password changed successfuly"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"details": "your link is no longer valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )
