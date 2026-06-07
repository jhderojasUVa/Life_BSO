package com.jhderojas.bsoofyourlife

import org.junit.Assert.assertEquals
import org.junit.Test

class CaptureRetryPolicyTest {

    @Test
    fun backoffDelayMs_appliesExponentialBackoff() {
        assertEquals(500L, CaptureRetryPolicy.backoffDelayMs(attempt = 1))
        assertEquals(1000L, CaptureRetryPolicy.backoffDelayMs(attempt = 2))
        assertEquals(2000L, CaptureRetryPolicy.backoffDelayMs(attempt = 3))
    }

    @Test
    fun backoffDelayMs_capsAtMaxDelay() {
        assertEquals(4000L, CaptureRetryPolicy.backoffDelayMs(attempt = 8))
    }
}
