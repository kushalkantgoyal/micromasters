// @flow
/* global SETTINGS: false */
import React from "react"
import Dialog from "material-ui/Dialog"
import { connect } from "react-redux"
import URI from "urijs"

import { createSimpleActionHelpers } from "../lib/redux"
import { setDialogVisibility } from "../actions/signup_dialog"

type signupProps = {
  open: boolean,
  setDialogVisibility: (b: boolean) => void
}

const dialogStyle = {
  maxWidth: "500px"
}

const SignupDialog = ({ open, setDialogVisibility }: signupProps) => {
  let loginUrl = URI("/login/edxorg")
  const urlQuery = URI(window.location.search).query(true)
  let nextUrl = urlQuery.next
  if (!nextUrl && urlQuery.coupon) {
    nextUrl = URI("/dashboard/").setSearch("coupon", urlQuery.coupon)
  }
  if (nextUrl) {
    loginUrl = loginUrl.setSearch("next", nextUrl)
  }
  return (
    <Dialog
      titleClassName="dialog-title"
      contentClassName="dialog signup-dialog"
      className="signup-dialog-wrapper"
      open={open}
      onRequestClose={() => setDialogVisibility(false)}
      contentStyle={dialogStyle}
      autoScrollBodyContent={true}
    >
      <div className="signup-dialog">
        <div className="logos">
          <img
            className="edx_logo"
            src="/static/images/edx_logo.png"
            alt="edX"
          />
          <img
            className="mitx_logo"
            src="/static/images/mitx_logo.png"
            alt="MITx"
          />
        </div>
        <p>
          All MITx MicroMasters courses are delivered on edX. To sign up for a
          MITx MicroMasters program you need an edX account.
        </p>

        <a className="mdl-button signup-modal-button" href={loginUrl}>
          Continue with edX
        </a>
        <div className="terms-of-service-text">
          {'By clicking "Continue with edX" I certify that I agree with '}
          <a href="/terms_of_service" target="_blank" rel="noopener noreferrer">
            MITx MicroMasters Terms of Service.
          </a>
          {" Read our "}
          <a
            href="http://web.mit.edu/referencepubs/nondiscrimination/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nondiscrimination Policy.
          </a>
        </div>
      </div>
    </Dialog>
  )
}

const mapStateToProps = state => ({
  open: state.signupDialog.dialogVisibility
})

const mapDispatchToProps = dispatch =>
  createSimpleActionHelpers(dispatch, [
    ["setDialogVisibility", setDialogVisibility]
  ])

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupDialog)
