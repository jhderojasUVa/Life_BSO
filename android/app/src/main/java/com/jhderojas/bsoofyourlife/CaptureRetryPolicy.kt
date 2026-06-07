package com.jhderojas.bsoofyourlife

object CaptureRetryPolicy {
    fun backoffDelayMs(
        attempt: Int,
        baseDelayMs: Long = 500L,
        maxDelayMs: Long = 4000L
    ): Long {
        require(attempt >= 1) { "attempt must be >= 1" }
        require(baseDelayMs > 0) { "baseDelayMs must be > 0" }
        require(maxDelayMs >= baseDelayMs) { "maxDelayMs must be >= baseDelayMs" }

        val exponent = (attempt - 1).coerceAtMost(10)
        val rawDelay = baseDelayMs * (1L shl exponent)
        return rawDelay.coerceAtMost(maxDelayMs)
    }
}
