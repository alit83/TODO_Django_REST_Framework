{% extends "mail_templated/base.tpl" %}

{% block subject %}
forgetpassword
{% endblock %}

{% block body %}
This is a plain text part.
{% endblock %}

{% block html %}
http://127.0.0.1:3000/verify-email/{{uidb64}}/{{token}}
{% endblock %}