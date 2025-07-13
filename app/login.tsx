import { DEV_EMAIL, DEV_PASSWORD, IS_DEV } from '@/constants/supabase';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const isEmailMatch = !isSignUp || email === emailConfirm;
  const isPasswordMatch = !isSignUp || password === passwordConfirm;
  
  const handleLogin = async () => {
    console.log(IS_DEV, DEV_EMAIL, DEV_PASSWORD);
    if (IS_DEV) {
      await signIn(DEV_EMAIL, DEV_PASSWORD);
      return
    }
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      const errorMessage = await signIn(email, password);
      if (errorMessage) {
        setError(errorMessage);
      }
    } catch (e: any) {
      setError(e.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError('');
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
    } catch (e: any) {
      setError(e.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
      {isSignUp && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            textContentType="givenName"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            textContentType="familyName"
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        textContentType="emailAddress"
      />
      {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={emailConfirm}
            onChangeText={setEmailConfirm}
            textContentType="emailAddress"
          />
      )}
      {!isPasswordMatch ? <Text style={styles.error}>Emails do not match</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        textContentType="password"
      />
      {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            textContentType="password"
          />
      )}
      {!isPasswordMatch ? <Text style={styles.error}>Passwords do not match</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={isSignUp ? handleSignUp : handleLogin}
        disabled={loading && (!isEmailMatch || !isPasswordMatch)}
        accessibilityLabel={isSignUp ? 'Sign Up' : 'Sign In'}
      >
        <Text style={styles.buttonText}>{loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}</Text>
      </TouchableOpacity>
      {!isSignUp ? (
        <TouchableOpacity onPress={() => setIsSignUp(true)} style={styles.linkBtn} accessibilityLabel="Go to Sign Up">
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setIsSignUp(false)} style={styles.linkBtn} accessibilityLabel="Go to Sign In">
          <Text style={styles.linkText}>Sign In</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fb',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#3b5998',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  error: {
    color: '#d11a2a',
    marginBottom: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  linkBtn: {
    marginTop: 16,
  },
  linkText: {
    color: '#3b5998',
    textDecorationLine: 'underline',
    fontSize: 16,
    textAlign: 'center',
  },
}); 