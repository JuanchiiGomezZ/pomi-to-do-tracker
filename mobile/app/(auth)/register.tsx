'use client';

import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth, GuestRoute } from '@/features/auth';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const {
    register,
    isRegistering,
    registerError,
  } = useAuth();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    try {
      await register({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <GuestRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#999"
          />

          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#999"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        {registerError && (
          <Text style={styles.error}>{registerError.message}</Text>
        )}

        {isRegistering ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </GuestRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  halfInput: {
    flex: 1,
  },
  error: {
    color: '#ff3b30',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 24,
    padding: 8,
  },
  linkText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  linkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
