{% extends "mail_templated/base.tpl" %}

{% block subject %}
Click on the url to verify you email
{% endblock %}

{% block body %}
This is a plain text part.
{% endblock %}

{% block html %}
http://127.0.0.1:3000/confirm-email/{{uidb64}}/{{token}}
{% endblock %}