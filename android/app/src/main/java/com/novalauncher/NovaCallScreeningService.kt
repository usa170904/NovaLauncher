package com.novalauncher

import android.telecom.Call.Details
import android.telecom.CallScreeningService

class NovaCallScreeningService : CallScreeningService() {
    override fun onScreenCall(callDetails: Details) {
        respondToCall(callDetails, CallResponse.Builder().setDisallowCall(false).setRejectCall(false).setSilenceCall(false).build())
    }
}
