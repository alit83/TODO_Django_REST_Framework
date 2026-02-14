from celery import shared_task
from mail_templated import EmailMessage
from tasks.models import Done
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
def delete_all_finished_task_every_week():
    #print('test mikonam')
    Done.objects.all().delete()
