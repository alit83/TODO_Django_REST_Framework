{% extends "mail_templated/base.tpl" %}

{% block subject %}
forgetpassword {{ token }}
{% endblock %}

{% block body %}
This is a plain text part.
{% endblock %}

{% block html %}
This is an <strong>{{uidb64}}</strong> part.
{% endblock %}