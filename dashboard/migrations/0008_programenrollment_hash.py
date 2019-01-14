# Generated by Django 2.1.2 on 2018-12-14 21:29

from django.db import migrations, models

from micromasters.utils import generate_md5


def populate_enrollment_hash(apps, schema_editor):
    ProgramEnrollment = apps.get_model('dashboard', 'ProgramEnrollment')
    for enrollment in ProgramEnrollment.objects.all():
        enrollment.hash = generate_md5(
            '{}|{}'.format(enrollment.user_id, enrollment.program_id).encode('utf-8')
        )
        enrollment.save()


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0007_cached_data_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='programenrollment',
            name='hash',
            field=models.CharField(default='hash', max_length=32),
        ),
        migrations.RunPython(populate_enrollment_hash, migrations.RunPython.noop),
    ]