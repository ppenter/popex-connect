import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import QR from 'react-native-qrcode-svg';

export type QrcodeProps = {
  readonly uri?: string;
  readonly size?: number;
};

const padding = 15;

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mt: {
    marginTop: 50,
  },
  qr: {
    padding,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderRadius: padding,
  },
});

export default function Qrcode({
  size = 300,
  uri,
}: QrcodeProps): JSX.Element {
  if (!uri) {
    return null
  }
  return (
    <View style={[{ width: '100%', height: '80%' }, styles.center, styles.qr, styles.mt]}>
      {typeof uri === 'string' && !!uri.length && (
        // @ts-ignore
        <QR logoSize={size} value={uri} size={size - padding * 2} />
      )}
    </View>
  );
}