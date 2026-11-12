import { httpClient } from '@/core/api/axios.adapter';
import {
  AuthResponse,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  OnboardingPayload,
  OnboardingResponse,
} from '../interfaces/auth.interface';

export class AuthService {
  /**
   * Authenticates a user and retrieves session tokens alongside user profile data.
   *
   * @param payload - The login credentials (identifier, password, domain).
   * @returns A promise that resolves to the authentication response containing user data and JWT token.
   */
  static async login(payload: LoginPayload): Promise<AuthResponse> {
    return await httpClient.post<AuthResponse>(`/auth/login`, payload);
  }

  /**
   * Completes the onboarding flow for a newly registered user by updating credentials.
   *
   * @param payload - The new email and new password.
   * @returns A promise resolving to the new session tokens and profile.
   */
  static async onboarding(
    payload: OnboardingPayload
  ): Promise<OnboardingResponse> {
    return await httpClient.post<OnboardingResponse>(`/auth/onboarding`, {
      newEmail: payload.email,
      newPassword: payload.password,
    });
  }

  /**
   * Requests a password reset email for a specific account.
   *
   * @param payload - Object containing the user's email address.
   * @returns A promise that resolves to a confirmation message indicating the email was sent.
   */
  static async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<{ message: string }> {
    return await httpClient.post<{ message: string }>(
      `/auth/forgot-password`,
      payload
    );
  }

  /**
   * Resets the user's password using a valid recovery token provided via email.
   *
   * @param payload - Object containing the recovery token and the new password.
   * @returns A promise that resolves to a success message upon password update.
   */
  static async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<{ message: string }> {
    return await httpClient.post<{ message: string }>(
      `/auth/reset-password`,
      payload
    );
  }

  /**
   * Invalidates the current session tokens on the server, effectively logging the user out.
   *
   * @returns A promise that resolves to a success message upon successful logout.
   */
  static async logout(): Promise<{ message: string }> {
    return await httpClient.post<{ message: string }>(`/auth/logout`);
  }
}
