# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-09-27 15:47
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0031_programcertificatesignatories'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursecertificatesignatories',
            name='course',
            field=models.ForeignKey(help_text='The course for this certificate.', on_delete=django.db.models.deletion.CASCADE, related_name='signatories', to='courses.Course'),
        ),
    ]