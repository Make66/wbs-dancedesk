import * as Location from 'expo-location';

export async function getCurrentLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) throw new Error('Location permission not granted');
  return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
}
