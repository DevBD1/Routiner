import * as AuthSession from "expo-auth-session";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import { EXPO_PUBLIC_AUTH0_DOMAIN, EXPO_PUBLIC_AUTH0_CLIENT_ID } from '@env';

// Auth0 configuration from environment variables
const auth0Domain = EXPO_PUBLIC_AUTH0_DOMAIN;
const auth0ClientId = EXPO_PUBLIC_AUTH0_CLIENT_ID;
const authorizationEndpoint = `https://${auth0Domain}/authorize`;

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ 
  scheme: "routiner",
  useProxy 
});

export default function App() {
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      responseType: "id_token",
      scopes: ["openid", "profile", "email"],
      extraParams: {
        nonce: Math.random().toString(36).substring(2, 10),
      },
    },
    { authorizationEndpoint }
  );

  // Log the redirect URL for configuration
  useEffect(() => {
    console.log(`Redirect URL: ${redirectUri}`);
  }, []);

  useEffect(() => {
    if (result) {
      setIsLoading(true);
      if (result.error) {
        Alert.alert(
          "Authentication error",
          result.params.error_description || "Something went wrong"
        );
        setIsLoading(false);
        return;
      }
      if (result.type === "success") {
        try {
          const jwtToken = result.params.id_token;
          const decoded = jwtDecode(jwtToken);
          const { name, email } = decoded;
          setName(name || email);
        } catch (error) {
          Alert.alert("Error", "Failed to decode the authentication token");
        }
      }
      setIsLoading(false);
    }
  }, [result]);

  return (
    <View style={styles.container}>
      {name ? (
        <>
          <Text style={styles.title}>Welcome, {name}!</Text>
          <Button title="Log out" onPress={() => setName(null)} />
        </>
      ) : (
        <Button
          disabled={!request || isLoading}
          title={isLoading ? "Loading..." : "Log in with Auth0"}
          onPress={() => promptAsync({ useProxy })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
  },
});
