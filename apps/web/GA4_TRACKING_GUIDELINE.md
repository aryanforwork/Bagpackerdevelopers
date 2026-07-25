# GA4 Custom Event Tracking Checklist

This document details the telemetry events configuration for Google Analytics 4 (GA4) in the frontend client application.

## Event Specifications

### 1. `roi_calculator_view`
* **Trigger**: Fired when the Interactive ROI Calculator is scrolled into the viewport.
* **Telemetry Payload**:
  ```typescript
  window.gtag('event', 'roi_calculator_view', {
    event_category: 'engagement',
    engagement_time_msec: Date.now()
  });
  ```

### 2. `roi_calculator_change`
* **Trigger**: Fired when the manual hours or hourly rate sliders are adjusted.
* **Telemetry Payload**:
  ```typescript
  window.gtag('event', 'roi_calculator_change', {
    manual_hours: manualHours,
    hourly_rate: hourlyRate,
    projected_annual_savings: annualSavings
  });
  ```

### 3. `lead_conversion_submit`
* **Trigger**: Fired on successful lead submission to the Spring Boot endpoint.
* **Telemetry Payload**:
  ```typescript
  window.gtag('event', 'lead_conversion_submit', {
    company_name: company,
    estimated_annual_savings: annualSavings,
    net_roi: netRoi
  });
  ```

### 4. `sandbox_ocr_execute`
* **Trigger**: Fired when the IDP Sandbox OCR compilation is run.
* **Telemetry Payload**:
  ```typescript
  window.gtag('event', 'sandbox_ocr_execute', {
    input_length: content.length,
    execution_success: !error
  });
  ```
