# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-16 20:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('exams', '0013_require_date_grades_available'),
        ('grades', '0005_proctoredexamgrade_exam_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='proctoredexamgrade',
            name='exam_run',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='exams.ExamRun'),
        ),
    ]
