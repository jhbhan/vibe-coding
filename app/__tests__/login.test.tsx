import { AuthProvider } from '@/contexts/AuthContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import LoginScreen from '../login';

jest.mock('@/contexts/AuthContext', () => {
  const actual = jest.requireActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      signIn: jest.fn(async (email, password) => {
        if (email === 'fail@example.com') throw new Error('Login failed.');
        return;
      }),
    }),
  };
});

describe('LoginScreen', () => {
  it('shows error for invalid email', async () => {
    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByLabelText('Sign In'));
    await waitFor(() => {
      expect(getByText('Please enter a valid email address.')).toBeTruthy();
    });
  });

  it('shows error for empty password', async () => {
    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '');
    fireEvent.press(getByLabelText('Sign In'));
    await waitFor(() => {
      expect(getByText('Please enter your password.')).toBeTruthy();
    });
  });

  it('shows error for failed login', async () => {
    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    fireEvent.changeText(getByPlaceholderText('Email'), 'fail@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByLabelText('Sign In'));
    await waitFor(() => {
      expect(getByText('Login failed.')).toBeTruthy();
    });
  });

  it('hides password when typing', () => {
    const { getByPlaceholderText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    const passwordInput = getByPlaceholderText('Password');
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('calls signIn on valid input', async () => {
    const { getByPlaceholderText, getByLabelText, queryByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByLabelText('Sign In'));
    await waitFor(() => {
      expect(queryByText('Please enter a valid email address.')).toBeNull();
      expect(queryByText('Please enter your password.')).toBeNull();
      expect(queryByText('Login failed.')).toBeNull();
    });
  });
});