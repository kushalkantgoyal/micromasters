# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-26 18:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0009_profile_student_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='agreed_to_terms_of_service',
            field=models.BooleanField(default=False),
        ),
    ]
