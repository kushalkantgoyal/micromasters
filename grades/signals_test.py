"""
Tests for signals
"""
from unittest.mock import patch

from django.db.models.signals import post_save
from factory.django import mute_signals

from courses.factories import CourseFactory, CourseRunFactory
from grades.factories import (
    MicromastersCourseCertificateFactory,
    ProctoredExamGradeFactory,
    FinalGradeFactory,
)
from profiles.factories import ProfileFactory
from search.base import MockedESTestCase


# pylint: disable=unused-argument
@patch('search.signals.transaction.on_commit', side_effect=lambda callback: callback())
class CourseCertificateTests(MockedESTestCase):
    """
    Test certificate generation
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        with mute_signals(post_save):
            cls.user = ProfileFactory.create().user

    @patch('grades.signals.generate_program_certificate', autospec=True)
    def test_create_course_certificate(self, generate_program_cert_mock, mock_on_commit):
        """
        Test that generate_program_certificate is called when a course
        certificate is created
        """
        course = CourseFactory.create()
        cert = MicromastersCourseCertificateFactory.create(user=self.user, course=course)
        generate_program_cert_mock.assert_called_once_with(self.user, course.program)
        cert.save()
        generate_program_cert_mock.assert_called_once_with(self.user, course.program)


# pylint: disable=unused-argument
@patch('search.signals.transaction.on_commit', side_effect=lambda callback: callback())
class ProctoredExamGradesTests(MockedESTestCase):
    """
    Test certificate generation
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        with mute_signals(post_save):
            cls.user = ProfileFactory.create().user
            cls.course = CourseFactory.create()

    @patch('grades.signals.update_or_create_combined_final_grade', autospec=True)
    def test_create_exam_grade(self, update_grade_mock, mock_on_commit):
        """
        Test that update_or_create_combined_final_grade is called when a proctored exam
        grade is created or updated
        """
        exam_grade = ProctoredExamGradeFactory.create(user=self.user, course=self.course)
        update_grade_mock.assert_called_once_with(self.user, self.course)
        exam_grade.save()
        assert update_grade_mock.call_count == 2
        # create another exam grade for a different exam run
        ProctoredExamGradeFactory.create(user=self.user, course=self.course)
        assert update_grade_mock.call_count == 3


# pylint: disable=unused-argument
@patch('search.signals.transaction.on_commit', side_effect=lambda callback: callback())
@patch('grades.signals.update_or_create_combined_final_grade', autospec=True)
@patch('grades.signals.generate_program_letter', autospec=True)
class FinalGradeTests(MockedESTestCase):
    """
    Test signals for final grade creation
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        with mute_signals(post_save):
            cls.user = ProfileFactory.create().user

    def test_create_final_grade_fa(self, generate_letter_mock, update_grade_mock, mock_on_commit):
        """
        Test that final grades created for non-FA courses will try to update combined final grades.
        """
        fa_course_run = CourseRunFactory.create(course__program__financial_aid_availability=True)
        FinalGradeFactory.create(user=self.user, course_run=fa_course_run, grade=0.9)
        update_grade_mock.assert_called_once_with(self.user, fa_course_run.course)
        generate_letter_mock.assert_not_called()

    def test_create_final_grade_non_fa(self, generate_letter_mock, update_grade_mock, mock_on_commit):
        """
        Test that final grades created for non-FA courses will try to update combined final grades and
        generate a program commendation letter.
        """
        non_fa_course_run = CourseRunFactory.create(course__program__financial_aid_availability=False)
        FinalGradeFactory.create(user=self.user, course_run=non_fa_course_run, grade=0.9)
        update_grade_mock.assert_called_once_with(self.user, non_fa_course_run.course)
        generate_letter_mock.assert_called_once_with(self.user, non_fa_course_run.course.program)
