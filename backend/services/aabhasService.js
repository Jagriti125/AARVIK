/**
 * ==============================================================================
 * AABHAS AI/ML MODEL INTEGRATION SERVICE
 * ==============================================================================
 * 
 * CONCEPTUAL SEPARATION:
 * - AABHAS: Dedicated Machine Learning / Deep Learning model trained for landslide
 *   susceptibility and dynamic slope hazard prediction using geological, rainfall,
 *   and topographic parameters.
 * - AARVIK: The Web-Based Early Warning & Monitoring platform (this application)
 *   providing user reporting, public alerts, manual observations, and dashboarding.
 * 
 * CURRENT STATUS:
 * - Direct AI/ML inference connection is UNCONNECTED in this version.
 * - Current records are manually entered observations or clearly labeled
 *   demonstration data.
 * - Fake predictions must NEVER be portrayed as AI-generated.
 * 
 * FUTURE INTEGRATION SPECIFICATION:
 * When the AABHAS model server is deployed (e.g. FastAPI / Flask / TorchServe):
 * 1. Set AABHAS_API_URL in backend/.env (e.g. https://aabhas.internal.api/v1/predict)
 * 2. Set AABHAS_API_KEY in backend/.env
 * 3. The service below will transmit sensor/rainfall payloads and return
 *    predicted susceptibility indices, risk classification, and confidence levels.
 */

class AabhasIntegrationService {
  constructor() {
    this.apiUrl = process.env.AABHAS_API_URL || null;
    this.apiKey = process.env.AABHAS_API_KEY || null;
    this.isConnected = false;
  }

  /**
   * Health check to test if AABHAS inference server is reachable
   */
  async checkConnectionStatus() {
    if (!this.apiUrl || !this.apiKey) {
      return {
        connected: false,
        status: 'DISCONNECTED',
        message:
          'AABHAS API endpoint is not configured in environment variables. Currently operating in manual/demonstration mode.',
        futureEndpoint: this.apiUrl || 'Not specified',
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: { 'X-API-KEY': this.apiKey },
        signal: AbortSignal.timeout(3000),
      });
      this.isConnected = response.ok;
      return {
        connected: this.isConnected,
        status: this.isConnected ? 'ONLINE' : 'DEGRADED',
        message: 'Connected to AABHAS prediction server.',
      };
    } catch (err) {
      this.isConnected = false;
      return {
        connected: false,
        status: 'UNREACHABLE',
        message: `Could not reach AABHAS inference service: ${err.message}`,
      };
    }
  }

  /**
   * Predict landslide risk for a specified terrain and rainfall observation
   * 
   * @param {Object} parameters
   * @param {number} parameters.latitude
   * @param {number} parameters.longitude
   * @param {number} parameters.rainfall24h - 24h cumulative rainfall (mm)
   * @param {number} [parameters.slopeAngle] - Slope inclination in degrees
   * @param {string} [parameters.soilType] - Soil texture/geology classification
   * @returns {Promise<Object>}
   */
  async requestPrediction(parameters) {
    if (!this.apiUrl || !this.apiKey) {
      throw new Error(
        'AABHAS integration is currently in design mode. Manual risk assessment must be used until the AABHAS prediction API is connected.'
      );
    }

    try {
      const response = await fetch(`${this.apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify(parameters),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`AABHAS service responded with HTTP status ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        dataSource: 'AABHAS model output',
        predictedRiskLevel: data.riskLevel, // 'Low' | 'Moderate' | 'High' | 'Critical'
        confidence: data.confidence,
        susceptibilityIndex: data.susceptibilityIndex,
        factors: data.factors || [],
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error(`[AABHAS Service] Prediction call failed: ${err.message}`);
      throw new Error(`AABHAS API prediction error: ${err.message}`);
    }
  }
}

module.exports = new AabhasIntegrationService();
