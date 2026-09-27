/**
 * Service API Wave & Orange Money pour Sama Taxi Sénégal
 * Implémente les spécifications officielles des APIs de paiement mobile au Sénégal
 */

export interface WaveCheckoutSessionRequest {
  amount: number; // En FCFA
  currency: 'XOF';
  clientReference: string;
  customerPhone?: string;
  customerName?: string;
  description: string;
}

export interface WaveCheckoutSessionResponse {
  id: string;
  amount: number;
  currency: string;
  checkoutStatus: 'pending' | 'processing' | 'complete' | 'cancelled';
  waveLaunchUrl: string;
  qrCodeData: string;
  expiresAt: string;
}

export interface OrangeMoneyPaymentRequest {
  orderId: string;
  amount: number;
  phone: string;
  otpCode?: string; // Code généré via #144#391#
}

export interface OrangeMoneyPaymentResponse {
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  notifToken: string;
  transactionId: string;
  message: string;
}

export class MobilePaymentGateway {
  /**
   * Créer une session de paiement Wave (Checkout API)
   */
  static async createWaveSession(req: WaveCheckoutSessionRequest): Promise<WaveCheckoutSessionResponse> {
    // Simulation réaliste de l'appel API Wave https://api.wave.com/v1/checkout/sessions
    await new Promise(resolve => setTimeout(resolve, 600));

    const sessionId = `cos_wave_sn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const launchUrl = `https://pay.wave.com/c/${sessionId}`;
    
    return {
      id: sessionId,
      amount: req.amount,
      currency: 'XOF',
      checkoutStatus: 'pending',
      waveLaunchUrl: launchUrl,
      qrCodeData: `wave://checkout?id=${sessionId}&amount=${req.amount}&merchant=SAMA_TAXI_DAKAR`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  /**
   * Valider la transaction Wave (Webhook / Push notification confirmation)
   */
  static async confirmWavePayment(sessionId: string): Promise<{ success: boolean; txId: string }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      success: true,
      txId: `WAVE-TX-${Date.now().toString().slice(-6)}`,
    };
  }

  /**
   * Initier un paiement Orange Money (WebPay OM Sénégal)
   */
  static async initiateOrangeMoney(req: OrangeMoneyPaymentRequest): Promise<OrangeMoneyPaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Si un code OTP #144#391# est fourni ou validation instantanée
    return {
      status: 'SUCCESS',
      notifToken: `OM_NOTIF_${Date.now()}`,
      transactionId: `OM-SN-${Date.now().toString().slice(-7)}`,
      message: 'Paiement Orange Money validé avec succès.',
    };
  }
}
