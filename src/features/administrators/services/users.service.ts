import { httpClient } from '@/core/api/axios.adapter';
import { PaginatedResult } from '@/common/interfaces/pagination.interface';
import {
  ChangePasswordPayload,
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '../interfaces/user.interface';

export class UsersService {
  private static readonly ENDPOINT = '/users';

  /**
   * Retrieves a paginated and optionally filtered list of users (administrators).
   * 
   * @param page - The page number to fetch (defaults to 1).
   * @param limit - The number of records per page (defaults to 10).
   * @param term - Optional search term to filter users by name, email, or other relevant fields.
   * @returns A promise that resolves to a paginated result containing the user list and metadata.
   */
  static async getAll(
    page: number = 1,
    limit: number = 10,
    term?: string
  ): Promise<PaginatedResult<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (term) {
      params.append('term', term.trim());
    }

    return await httpClient.get<PaginatedResult<User>>(
      `${this.ENDPOINT}?${params.toString()}`
    );
  }

  /**
   * Retrieves detailed information of a specific user by their unique identifier.
   * 
   * @param id - The UUID of the user to retrieve.
   * @returns A promise that resolves to the user's data.
   */
  static async getById(id: string): Promise<User> {
    return await httpClient.get<User>(`${this.ENDPOINT}/${id}`);
  }

  /**
   * Creates a new user (administrator) in the system.
   * 
   * @param payload - The required data for creating a new user, including credentials and role.
   * @returns A promise that resolves to the newly created user object.
   */
  static async create(payload: CreateUserPayload): Promise<User> {
    return await httpClient.post<User>(this.ENDPOINT, payload);
  }

  /**
   * Updates an existing user's profile information.
   * 
   * @param id - The UUID of the user to update.
   * @param payload - The partial data payload containing the fields to be updated.
   * @returns A promise that resolves to the updated user object.
   */
  static async update(id: string, payload: UpdateUserPayload): Promise<User> {
    return await httpClient.patch<User>(`${this.ENDPOINT}/${id}`, payload);
  }

  /**
   * Permanently removes a user from the system.
   * 
   * @param id - The UUID of the user to remove.
   * @returns A promise that resolves to the deleted user's data.
   */
  static async remove(id: string): Promise<User> {
    return await httpClient.delete<User>(`${this.ENDPOINT}/${id}`);
  }

  /**
   * Changes a user's password securely.
   * 
   * @param id - The UUID of the user whose password is changing.
   * @param payload - Object containing the current password and the new password.
   * @returns A promise that resolves to a success message upon completion.
   */
  static async changePassword(
    id: string,
    payload: ChangePasswordPayload
  ): Promise<{ message: string }> {
    return await httpClient.patch<{ message: string }>(
      `${this.ENDPOINT}/${id}/change-password`,
      payload
    );
  }
}
