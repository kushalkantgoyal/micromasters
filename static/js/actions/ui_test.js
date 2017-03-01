import {
  CLEAR_UI,
  UPDATE_DIALOG_TEXT,
  UPDATE_DIALOG_TITLE,
  SET_DIALOG_VISIBILITY,
  SET_WORK_DIALOG_VISIBILITY,
  SET_WORK_DIALOG_INDEX,
  SET_EDUCATION_DIALOG_VISIBILITY,
  SET_EDUCATION_DIALOG_INDEX,
  SET_EDUCATION_DEGREE_LEVEL,
  SET_EDUCATION_LEVEL_ANSWERS,
  SET_WORK_HISTORY_ANSWER,
  SET_LEARNER_PAGE_DIALOG_VISIBILITY,
  SET_SHOW_EDUCATION_DELETE_DIALOG,
  SET_SHOW_WORK_DELETE_DIALOG,
  SET_DELETION_INDEX,
  SET_PROFILE_STEP,
  SET_USER_MENU_OPEN,
  SET_SEARCH_FILTER_VISIBILITY,
  SET_EMAIL_DIALOG_VISIBILITY,
  SET_PAYMENT_TEASER_DIALOG_VISIBILITY,
  SET_ENROLL_PROGRAM_DIALOG_ERROR,
  SET_ENROLL_PROGRAM_DIALOG_VISIBILITY,
  SET_TOAST_MESSAGE,
  SET_ENROLL_SELECTED_PROGRAM,
  SET_PHOTO_DIALOG_VISIBILITY,
  SET_CALCULATOR_DIALOG_VISIBILITY,
  SET_PROGRAM,
  SET_CONFIRM_SKIP_DIALOG_VISIBILITY,
  SET_DOCS_INSTRUCTIONS_VISIBILITY,
  SET_COUPON_NOTIFICATION_VISIBILITY,
  SET_NAV_DRAWER_OPEN,
  SET_LEARNER_CHIP_VISIBILITY,

  clearUI,
  updateDialogText,
  updateDialogTitle,
  setDialogVisibility,
  setWorkDialogVisibility,
  setWorkDialogIndex,
  setEducationDialogVisibility,
  setEducationDialogIndex,
  setEducationDegreeLevel,
  setEducationLevelAnswers,
  setWorkHistoryAnswer,
  setLearnerPageDialogVisibility,
  setShowEducationDeleteDialog,
  setShowWorkDeleteDialog,
  setDeletionIndex,
  setProfileStep,
  setUserMenuOpen,
  setSearchFilterVisibility,
  setEmailDialogVisibility,
  setPaymentTeaserDialogVisibility,
  setEnrollProgramDialogError,
  setEnrollProgramDialogVisibility,
  setToastMessage,
  setEnrollSelectedProgram,
  setPhotoDialogVisibility,
  setCalculatorDialogVisibility,
  setProgram,
  setConfirmSkipDialogVisibility,
  setDocsInstructionsVisibility,
  setCouponNotificationVisibility,
  setNavDrawerOpen,
  setLearnerChipVisibility,
} from '../actions/ui';
import { assertCreatedActionHelper } from './test_util';

describe('generated UI action helpers', () => {
  it('should create all action creators', () => {
    [
      [clearUI, CLEAR_UI],
      [updateDialogText, UPDATE_DIALOG_TEXT],
      [updateDialogTitle, UPDATE_DIALOG_TITLE],
      [setDialogVisibility, SET_DIALOG_VISIBILITY],
      [setWorkDialogVisibility, SET_WORK_DIALOG_VISIBILITY],
      [setWorkDialogIndex, SET_WORK_DIALOG_INDEX],
      [setEducationLevelAnswers, SET_EDUCATION_LEVEL_ANSWERS],
      [setEducationDialogVisibility, SET_EDUCATION_DIALOG_VISIBILITY],
      [setEducationDialogIndex, SET_EDUCATION_DIALOG_INDEX],
      [setEducationDegreeLevel, SET_EDUCATION_DEGREE_LEVEL],
      [setLearnerPageDialogVisibility, SET_LEARNER_PAGE_DIALOG_VISIBILITY],
      [setShowEducationDeleteDialog, SET_SHOW_EDUCATION_DELETE_DIALOG],
      [setShowWorkDeleteDialog, SET_SHOW_WORK_DELETE_DIALOG],
      [setDeletionIndex, SET_DELETION_INDEX],
      [setProfileStep, SET_PROFILE_STEP],
      [setUserMenuOpen, SET_USER_MENU_OPEN],
      [setSearchFilterVisibility, SET_SEARCH_FILTER_VISIBILITY],
      [setEmailDialogVisibility, SET_EMAIL_DIALOG_VISIBILITY],
      [setPaymentTeaserDialogVisibility, SET_PAYMENT_TEASER_DIALOG_VISIBILITY],
      [setEnrollProgramDialogError, SET_ENROLL_PROGRAM_DIALOG_ERROR],
      [setEnrollProgramDialogVisibility, SET_ENROLL_PROGRAM_DIALOG_VISIBILITY],
      [setToastMessage, SET_TOAST_MESSAGE],
      [setEnrollSelectedProgram, SET_ENROLL_SELECTED_PROGRAM],
      [setPhotoDialogVisibility, SET_PHOTO_DIALOG_VISIBILITY],
      [setCalculatorDialogVisibility, SET_CALCULATOR_DIALOG_VISIBILITY],
      [setProgram, SET_PROGRAM],
      [setConfirmSkipDialogVisibility, SET_CONFIRM_SKIP_DIALOG_VISIBILITY],
      [setDocsInstructionsVisibility, SET_DOCS_INSTRUCTIONS_VISIBILITY],
      [setCouponNotificationVisibility, SET_COUPON_NOTIFICATION_VISIBILITY],
      [setWorkHistoryAnswer, SET_WORK_HISTORY_ANSWER],
      [setNavDrawerOpen, SET_NAV_DRAWER_OPEN],
      [setLearnerChipVisibility, SET_LEARNER_CHIP_VISIBILITY],
    ].forEach(assertCreatedActionHelper);
  });
});
