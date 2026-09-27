package com.example.service

import com.example.model.SeverityLevel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import java.io.File

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class AgronomyDoctorServiceTest {

  // Contract test: this fixture is generated from the backend's own response model,
  // so a field rename on either side breaks this test.
  private val backendFixture = File("../backend/tests/fixtures/diagnose_response.json")

  @Test
  fun `parses backend diagnose response`() {
    val (reply, report) = AgronomyDoctorService.parseDiagnoseResponse(backendFixture.readText())

    assertEquals("Peacock spot detected.", reply)
    assertEquals("fixed-id", report.id)
    assertEquals(SeverityLevel.MODERATE, report.severity)
    assertEquals(87, report.confidenceScore)
    assertEquals(3, report.symptoms.size)
    assertEquals(12, report.alternativeHypotheses.single().probability)
    assertEquals(100, report.quantumOptimization.efficiencyGainPercent)
    assertEquals(2, report.treatments.culturalPractices.size)
    assertTrue(report.safetyDisclaimer.startsWith("Avertissement"))
  }

  @Test
  fun `tolerates missing optional fields`() {
    val json = """
      {"report": {"cropName": "Tomato", "diseaseName": "TYLCV", "severity": "UNKNOWN",
        "waterAdvisor": {}, "quantumOptimization": {}, "treatments": {}}}
    """.trimIndent()

    val (reply, report) = AgronomyDoctorService.parseDiagnoseResponse(json)

    assertEquals(SeverityLevel.MODERATE, report.severity)
    assertTrue(report.symptoms.isEmpty())
    assertTrue(report.id.isNotBlank())
    assertEquals(report.summary, reply)
  }
}
