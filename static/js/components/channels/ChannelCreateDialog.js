// @flow
/* global SETTINGS: false */
import Dialog from "material-ui/Dialog"
import React from "react"
import TextField from "material-ui/TextField"
import Grid, { Cell } from "react-mdl/lib/Grid"
import R from "ramda"

import { dialogActions } from "../inputs/util"
import { renderFilterOptions } from "../email/lib"

import type { ChannelState, Filter } from "../../flow/discussionTypes"
import type { AvailableProgram } from "../../flow/enrollmentTypes"

type ChannelCreateDialogProps = {
  channelDialog: ChannelState,
  isSavingChannel: boolean,
  dialogVisibility: boolean,
  currentProgramEnrollment: ?AvailableProgram,
  closeAndClearDialog: () => void,
  closeAndCreateDialog: () => void,
  updateFieldEdit: () => void
}

export default class ChannelCreateDialog extends React.Component {
  props: ChannelCreateDialogProps

  closeAndClear = (): void => {
    const { closeAndClearDialog } = this.props
    closeAndClearDialog()
  }

  closeAndCreate = (): void => {
    const { closeAndCreateDialog } = this.props
    closeAndCreateDialog()
  }

  showValidationError = (
    fieldName: string,
    ignoreVisibility: boolean = false
  ): ?React$Element<*> => {
    const {
      channelDialog: { validationErrors, validationVisibility }
    } = this.props
    const isVisible = R.propOr(false, fieldName)
    const val = validationErrors[fieldName]
    if (
      (isVisible(validationVisibility) && val !== undefined) ||
      ignoreVisibility
    ) {
      return <span className="validation-error">{val}</span>
    }
  }

  renderChannelFilters(program: AvailableProgram, filters: ?Array<Filter>) {
    if (!filters || R.isEmpty(filters)) {
      return (
        <div className="sk-selected-filters-list">
          <div className="sk-selected-filters-option sk-selected-filters__item">
            <div className="sk-selected-filters-option__name">
              All users in {program.title}
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="sk-selected-filters-list">
        {renderFilterOptions(filters)}
      </div>
    )
  }

  render() {
    const {
      channelDialog: { inputs, filters, validationErrors },
      dialogVisibility,
      currentProgramEnrollment,
      updateFieldEdit,
      isSavingChannel
    } = this.props

    if (!currentProgramEnrollment) {
      return null
    }

    return (
      <Dialog
        title="Create New Channel"
        titleClassName="dialog-title"
        contentClassName="dialog create-channel-dialog"
        className="create-channel-dialog-wrapper"
        open={dialogVisibility}
        onRequestClose={this.closeAndClear}
        actions={dialogActions(
          this.closeAndClear,
          this.closeAndCreate,
          isSavingChannel,
          "Create",
          "",
          !R.isEmpty(validationErrors)
        )}
      >
        <Grid>
          <Cell col={12}>
            <p>This channel is for:</p>
            {this.renderChannelFilters(currentProgramEnrollment, filters)}
          </Cell>
          <Cell col={12}>
            <TextField
              floatingLabelText="Title"
              name="title"
              value={inputs.title || ""}
              fullWidth={true}
              onChange={updateFieldEdit("title")}
              maxLength={100}
            />
            {this.showValidationError("title")}
          </Cell>
          <Cell col={12}>
            <TextField
              floatingLabelText="Name"
              name="name"
              value={inputs.name || ""}
              onChange={updateFieldEdit("name")}
              fullWidth={true}
              maxLength={21}
            />
            {this.showValidationError("name")}
            <p>
              No spaces, e.g., "lectures" or "lectureDiscussion". Once chosen,
              this cannot be changed. This only shows up in the channel URL.
            </p>
          </Cell>
          <Cell col={12}>
            <TextField
              floatingLabelText="Description"
              name="description"
              value={inputs.description || ""}
              onChange={updateFieldEdit("description")}
              fullWidth={true}
              multiLine={true}
              maxLength={500}
            />
            {this.showValidationError("description")}
            {/* 'detail' is the key for a backend permission error */}
            {this.showValidationError("detail", true)}
          </Cell>
        </Grid>
      </Dialog>
    )
  }
}
