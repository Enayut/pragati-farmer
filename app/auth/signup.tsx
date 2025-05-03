import { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useUserStore } from "../../store/userStore";
import { useRouter, Link } from "expo-router";

export default function SignupScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { registerUser, isLoading, error, clearError } = useUserStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState(""); // Add zipCode state
  const [role, setRole] = useState("farmer"); // Add role state with default "farmer"

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  // Validate zipcode - basic validation for Indian PIN codes
  const validateZipCode = (zipCode: string) => {
    return /^\d{6}$/.test(zipCode); // Indian PIN codes are 6 digits
  };

  const handleSignup = async () => {
    // Clear any previous errors
    clearError();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword || !address || !zipCode) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password should be at least 6 characters");
      return;
    }
    
    if (!validateZipCode(zipCode)) {
      Alert.alert("Validation Error", "Please enter a valid 6-digit PIN code");
      return;
    }

    try {
      await registerUser({
        name,
        email,
        role, // Use selected role instead of hardcoding "farmer"
        address,
        zipcode : zipCode // Add zipCode to registration data
      });

      // If no error was thrown, redirect to appropriate home based on role
      if (role === "buyer") {
        router.replace("/(buyer-tabs)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (err) {
      // The error is already handled in the store
    }
  };

  // Show error alert if there's an error
  if (error) {
    Alert.alert("Registration Error", error, [
      { text: "OK", onPress: clearError }
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign up to start managing your farm or buy crops
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter your farm address"
              placeholderTextColor={colors.textSecondary}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>
          
          {/* Add ZIP Code field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>PIN Code</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter your 6-digit PIN code"
              placeholderTextColor={colors.textSecondary}
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Add role selector after address field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>I am a</Text>
            <View style={styles.roleSelector}>
              <TouchableOpacity 
                style={[
                  styles.roleOption, 
                  role === 'farmer' && { 
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary 
                  }
                ]}
                onPress={() => setRole('farmer')}
              >
                <Text style={[
                  styles.roleText, 
                  { color: role === 'farmer' ? colors.primary : colors.textSecondary }
                ]}>
                  Farmer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.roleOption, 
                  role === 'buyer' && { 
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary 
                  }
                ]}
                onPress={() => setRole('buyer')}
              >
                <Text style={[
                  styles.roleText, 
                  { color: role === 'buyer' ? colors.primary : colors.textSecondary }
                ]}>
                  Buyer
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginTextContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Already have an account?{" "}
            </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "600",
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleOption: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
