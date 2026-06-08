from celery import shared_task
from mail_templated import EmailMessage

@shared_task
def send_email(email,token_hash,uidb64):
    message = EmailMessage(
            "email/email-verification.tpl",
            {"token": token_hash, "uidb64": uidb64},
            "todo@todo.com",
            to=[email],
        )
    message.send()
    print('ok sjod')

@shared_task
def send_forget_password_email(email,token,uidb64):
    message = EmailMessage(
            "email/email-forget-password.tpl",
            {"token": token, "uidb64": uidb64},
            "todo@todo.com",
            to=[email],
        )
    message.send()
    print('sss')

